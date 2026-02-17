import { sql } from "./neon";

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image_url: string;
    tags: string[];
    link: string | null;
    highlighted: boolean;
    created_at?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    photo_url: string | null;
    text: string;
    rating: number;
    initials: string;
    created_at?: string;
}

// --- Projects Service ---

export const ProjectsService = {
    async getAll() {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      SELECT * FROM public.projects ORDER BY created_at DESC
    `;
    },

    async create(project: Omit<Project, "id" | "created_at">) {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      INSERT INTO public.projects (title, category, description, image_url, tags, link, highlighted)
      VALUES (${project.title}, ${project.category}, ${project.description}, ${project.image_url}, ${project.tags}, ${project.link}, ${project.highlighted})
      RETURNING *
    `;
    },

    async update(id: string, project: Partial<Project>) {
        if (!sql) throw new Error("Database not configured");
        const updates: any[] = [];
        if (project.title !== undefined) updates.push(sql`title = ${project.title}`);
        if (project.category !== undefined) updates.push(sql`category = ${project.category}`);
        if (project.description !== undefined) updates.push(sql`description = ${project.description}`);
        if (project.image_url !== undefined) updates.push(sql`image_url = ${project.image_url}`);
        if (project.tags !== undefined) updates.push(sql`tags = ${project.tags}`);
        if (project.link !== undefined) updates.push(sql`link = ${project.link}`);
        if (project.highlighted !== undefined) updates.push(sql`highlighted = ${project.highlighted}`);

        // Add updated_at manually since it's always updated
        updates.push(sql`updated_at = NOW()`);

        if (updates.length <= 1) return []; // Nothing to update besides timestamp (or even less)

        // Construct dynamic update query (simplified for neon)
        // Note: neon/postgres driver template literals are strict. 
        // For dynamic columns, it's safer to pass full object if possible, but let's stick to full update for simplicity first version:

        return await sql`
      UPDATE public.projects
      SET title = ${project.title},
          category = ${project.category},
          description = ${project.description},
          image_url = ${project.image_url},
          tags = ${project.tags},
          link = ${project.link},
          highlighted = ${project.highlighted},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    },

    async delete(id: string) {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      DELETE FROM public.projects WHERE id = ${id}
    `;
    },
};

// --- Testimonials Service ---

export const TestimonialsService = {
    async getAll() {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      SELECT * FROM public.testimonials ORDER BY created_at DESC
    `;
    },

    async create(testimonial: Omit<Testimonial, "id" | "created_at">) {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      INSERT INTO public.testimonials (name, role, photo_url, text, rating, initials)
      VALUES (${testimonial.name}, ${testimonial.role}, ${testimonial.photo_url}, ${testimonial.text}, ${testimonial.rating}, ${testimonial.initials})
      RETURNING *
    `;
    },

    async update(id: string, testimonial: Partial<Testimonial>) {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      UPDATE public.testimonials
      SET name = ${testimonial.name},
          role = ${testimonial.role},
          photo_url = ${testimonial.photo_url},
          text = ${testimonial.text},
          rating = ${testimonial.rating},
          initials = ${testimonial.initials}
      WHERE id = ${id}
      RETURNING *
    `;
    },

    async delete(id: string) {
        if (!sql) throw new Error("Database not configured");
        return await sql`
      DELETE FROM public.testimonials WHERE id = ${id}
    `;
    },
};
