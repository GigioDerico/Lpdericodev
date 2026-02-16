import { motion } from "motion/react";
import { ArrowUpRight, Github, ExternalLink, Layers, Sparkles, Database, Smartphone } from "lucide-react";

const projects = [
  {
    title: "Nexus SaaS B2B",
    category: "Plataforma Multi-tenant",
    description: "Sistema completo de gestão empresarial com dashboard analítico em tempo real e arquitetura multi-tenant isolada.",
    image: "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    tags: ["Bubble.io", "React", "Node.js"],
    icon: Layers
  },
  {
    title: "FinFlow Mobile",
    category: "App Financeiro",
    description: "Aplicativo nativo para controle financeiro pessoal com sincronização bancária automática via Open Finance.",
    image: "https://images.unsplash.com/photo-1633431871820-ca72e0da2e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    tags: ["React Native", "Firebase", "API"],
    icon: Smartphone
  },
  {
    title: "Cyber AI Core",
    category: "Inteligência Artificial",
    description: "Módulo de IA generativa integrado para automação de atendimento e processamento de linguagem natural.",
    image: "https://images.unsplash.com/photo-1760931969401-9bd6ee902798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    tags: ["OpenAI", "Python", "Vector DB"],
    icon: Sparkles
  },
  {
    title: "DataSync Gov",
    category: "Integração Backend",
    description: "Middleware de alta performance para sincronização bidirecional com APIs governamentais legadas.",
    image: "https://images.unsplash.com/photo-1764258057610-be7ca21a0978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    tags: ["Node.js", "Docker", "SQL"],
    icon: Database
  }
];

export function Projects() {
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
              key={index}
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

                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  width="800"
                  height="600"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center gap-2">
                    <project.icon className="w-3 h-3 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-200 uppercase tracking-wide">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 relative">
                {/* Neon Glow on Hover */}
                <div className="absolute -bottom-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  {project.description}
                </p>

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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
