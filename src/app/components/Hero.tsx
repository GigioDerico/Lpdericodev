import { motion } from "motion/react";
import { ArrowRight, Code2, Database, Zap, Cpu, Terminal, Globe } from "lucide-react";
import profileImage from "../../assets/1766698fd4c6d21a55a82b9062b79bd60a61e1c1.png";

export function Hero() {
  return (
    <section id="about" className="relative min-h-[90vh] flex items-center pt-20 bg-[#0B0F19] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />

        {/* Animated Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Content - Typography & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 relative"
        >
          {/* Decorative Tag */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-indigo-500/30 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-indigo-300 tracking-wider">DISPONÍVEL PARA PROJETOS</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-medium text-slate-400 tracking-wide">
              Olá, eu sou <span className="text-white">Giorgio</span>
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Arquiteto <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  Full Stack
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-600/20 -z-0 skew-x-12"></span>
              </span>
            </h1>
          </div>

          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Especialista em aplicações <strong>Bubble.io</strong> de alta performance integradas com <strong>IA e Supabase</strong>. Construo produtos digitais escaláveis, não apenas telas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="https://wa.me/5511976019844?text=Vim%20do%20site%20Derico%20Dev%20e%20quero%20mais%20infromações%20sobre%20desenvolvimento%20de%20aplicativos."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-slate-950 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group"
            >
              Iniciar Projeto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#projects"
              className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center"
            >
              Ver Portfolio
            </a>
          </div>

          <div className="pt-8 flex items-center gap-6 text-slate-500 text-sm font-mono border-t border-slate-800/50 mt-8">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Código Limpo</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Entrega Rápida</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Banco Escalável</span>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Modern Tech Visual */}
        <div className="relative flex justify-center items-center h-full min-h-[500px]">
          {/* Rotating Rings Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="w-[500px] h-[500px] border border-slate-800 rounded-full border-dashed opacity-20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute w-[350px] h-[350px] border border-indigo-900/40 rounded-full opacity-40"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-[320px] h-[420px] md:w-[380px] md:h-[480px] z-10"
          >
            {/* Modern IDE/Window Mockup */}
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-indigo-500/30 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] overflow-hidden flex flex-col group">
              {/* Window Header */}
              <div className="h-8 bg-slate-950/80 border-b border-white/10 flex items-center px-4 gap-2 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="ml-4 text-[10px] text-cyan-400/80 font-mono flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  giorgio-profile.tsx
                </div>
              </div>

              {/* Main Content Area */}
              <div className="relative flex-1 overflow-hidden bg-slate-900">
                {/* Neon Glow Background behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />

                <img
                  src={profileImage}
                  alt="Giorgio Profile"
                  width="400"
                  height="500"
                  className="w-full h-full object-cover grayscale brightness-110 contrast-125 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110 z-0 relative"
                />

                {/* Cyberpunk Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent opacity-80 z-10" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,27,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none z-10 mix-blend-overlay" />

                {/* Floating Glass Cards Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="bg-slate-950/70 backdrop-blur-xl border-t border-l border-white/10 rounded-xl shadow-2xl p-4 transform transition-transform group-hover:translate-y-[-5px]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-bold">SISTEMA ONLINE</span>
                      </div>
                      <Cpu className="w-4 h-4 text-cyan-400" />
                    </div>

                    <div className="space-y-3">
                      {/* Skill 1 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                          <span className="text-slate-300">Lógica Bubble.io</span>
                          <span className="text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]">100%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        </div>
                      </div>

                      {/* Skill 2 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                          <span className="text-slate-300">Arquitetura de IA</span>
                          <span className="text-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.5)]">100%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 w-full shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                        </div>
                      </div>

                      {/* Skill 3 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                          <span className="text-slate-300">Segurança Backend</span>
                          <span className="text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]">100%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-green-600 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements around the card */}

          </motion.div>
        </div>
      </div>
    </section>
  );
}
