import { sql } from './_lib/neon';

export const config = {
    runtime: 'edge', // Using edge runtime for performance
};

export default async function handler(req: Request) {
    if (!sql) {
        return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    try {
        switch (req.method) {
            case 'GET': {
                const result = await sql`
          SELECT * FROM public.projects ORDER BY created_at DESC
        `;
                return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            case 'POST': {
                const body = await req.json();
                const { title, category, description, image_url, tags, link, highlighted } = body;

                const result = await sql`
          INSERT INTO public.projects (title, category, description, image_url, tags, link, highlighted)
          VALUES (${title}, ${category}, ${description}, ${image_url}, ${tags}, ${link}, ${highlighted})
          RETURNING *
        `;

                return new Response(JSON.stringify(result[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
            }

            case 'PUT': {
                if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

                const body = await req.json();
                const { title, category, description, image_url, tags, link, highlighted } = body;

                const result = await sql`
          UPDATE public.projects
          SET title = ${title},
              category = ${category},
              description = ${description},
              image_url = ${image_url},
              tags = ${tags},
              link = ${link},
              highlighted = ${highlighted},
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;

                return new Response(JSON.stringify(result[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            case 'DELETE': {
                if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

                await sql`
          DELETE FROM public.projects WHERE id = ${id}
        `;
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            default:
                return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
        }
    } catch (error: any) {
        console.error(`Failed to handle ${req.method} projects:`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
