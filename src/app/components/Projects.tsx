import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Layers, Loader2 } from "lucide-react";
import { ProjectsService } from "../../lib/services";
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string | null;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await ProjectsService.getAll();
        setProjects(result as Project[]);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null; // Don't render the section if there are no projects
  }

  return (
    <section id="projects" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,27,0)_0%,rgba(99,102,241,0.03)_50%,rgba(18,24,27,0)_100%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-indigo-400 font-medium text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-8 h-[1px] bg-indigo-500"></span>
              Portfolio Selecionado
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Experiência Real em <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Projetos de Alto Nível
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              De plataformas SaaS complexas a integrações de IA de ponta.
              Cada projeto é construído com foco em escalabilidade, segurança e experiência do usuário.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/30 transition-all duration-500"
            >
              {/* Image Container with Overlay */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-indigo-900/10 transition-colors z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />

                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    loading="lazy"
                    width="800"
                    height="600"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Layers className="w-12 h-12 text-slate-600" />
                  </div>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300"
                  >
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </a>
                )}

                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center gap-2">
                    <Layers className="w-3 h-3 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-200 uppercase tracking-wide">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 relative">
                <div className="absolute -bottom-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-md text-xs font-mono text-slate-300 group-hover:border-indigo-500/30 group-hover:text-indigo-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
