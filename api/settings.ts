import { sql } from './_lib/neon';

export const config = {
    runtime: 'edge', // Using edge runtime for performance
};

export default async function handler(req: Request) {
    if (!sql) {
        return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }

    const url = new URL(req.url);
    const key = url.searchParams.get('key');

    try {
        switch (req.method) {
            case 'GET': {
                if (key) {
                    const rows = await sql`SELECT * FROM public.site_settings WHERE key = ${key} LIMIT 1`;
                    const result = rows.length > 0 ? rows[0] : null;
                    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }

                const rows = await sql`SELECT * FROM public.site_settings ORDER BY key ASC`;
                return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            case 'POST': {
                const body = await req.json();
                const { key: reqKey, value, description } = body;

                const result = await sql`
          INSERT INTO public.site_settings (key, value, description, updated_at)
          VALUES (${reqKey}, ${value}, ${description ?? ''}, NOW())
          ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
          RETURNING *
        `;

                return new Response(JSON.stringify(result[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
            }

            case 'PUT': {
                if (!key) return new Response(JSON.stringify({ error: "Key is required format: ?key=value" }), { status: 400 });

                const body = await req.json();
                const { value } = body;

                const result = await sql`
          UPDATE public.site_settings SET value = ${value}, updated_at = NOW() WHERE key = ${key} RETURNING *
        `;

                return new Response(JSON.stringify(result[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            default:
                return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
        }
    } catch (error: any) {
        console.error(`Failed to handle ${req.method} settings:`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
