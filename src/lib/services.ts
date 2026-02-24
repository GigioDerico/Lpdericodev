// Service layer to interact with our new Serverless API

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
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  },

  async create(project: Omit<Project, "id" | "created_at">) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return [await res.json()];
  },

  async update(id: string, project: Partial<Project>) {
    const res = await fetch(`/api/projects?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return [await res.json()];
  },

  async delete(id: string) {
    const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete project");
    return await res.json();
  },
};

// --- Testimonials Service ---

export const TestimonialsService = {
  async getAll() {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    return await res.json();
  },

  async create(testimonial: Omit<Testimonial, "id" | "created_at">) {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    });
    if (!res.ok) throw new Error("Failed to create testimonial");
    return [await res.json()];
  },

  async update(id: string, testimonial: Partial<Testimonial>) {
    const res = await fetch(`/api/testimonials?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    });
    if (!res.ok) throw new Error("Failed to update testimonial");
    return [await res.json()];
  },

  async delete(id: string) {
    const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete testimonial");
    return await res.json();
  },
};

// --- Site Settings Service ---

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  updated_at?: string;
}

export const SettingsService = {
  async getAll(): Promise<SiteSetting[]> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error("Failed to fetch settings");
    return await res.json();
  },

  async getByKey(key: string): Promise<SiteSetting | null> {
    const res = await fetch(`/api/settings?key=${key}`);
    if (!res.ok) throw new Error("Failed to fetch setting by key");
    return await res.json();
  },

  async upsert(key: string, value: string, description?: string): Promise<SiteSetting[]> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value, description }),
    });
    if (!res.ok) throw new Error("Failed to upsert setting");
    return [await res.json()];
  },

  async updateValue(key: string, value: string): Promise<SiteSetting[]> {
    const res = await fetch(`/api/settings?key=${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error("Failed to update setting");
    return [await res.json()];
  },
};
