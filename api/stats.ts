import { sql } from './_lib/neon';

export const config = {
    runtime: 'edge', // Using edge runtime for performance
};

export default async function handler(req: Request) {
    if (!sql) {
        return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }

    try {
        if (req.method !== 'GET') {
            return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
        }

        const [projectsResult, testimonialsResult] = await Promise.all([
            sql`SELECT COUNT(*)::int as count FROM public.projects`,
            sql`SELECT COUNT(*)::int as count FROM public.testimonials`,
        ]);

        const stats = {
            projectsCount: projectsResult[0]?.count ?? 0,
            testimonialsCount: testimonialsResult[0]?.count ?? 0,
        };

        return new Response(JSON.stringify(stats), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error(`Failed to handle ${req.method} stats:`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
