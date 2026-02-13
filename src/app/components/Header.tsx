import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "figma:asset/82ab46cf0fac37a755e21a52f3dede7f1e1747aa.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const links = [
    { name: "Sobre", href: "#about" },
    { name: "Estratégia", href: "#strategy" },
    { name: "Projetos", href: "#projects" },
    { name: "Diferenciais", href: "#differentiators" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      {/* Neon Glow Background Effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        scrolled ? "opacity-100" : "opacity-0"
      }`}>
         <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 shadow-[0_0_20px_rgba(99,102,241,0.15)]" />
         {/* Gradient Line for Neon feel */}
         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <nav className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-12" : "h-16"
        } bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl px-6 shadow-2xl shadow-indigo-500/10`}>
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
              <img 
                src={logo} 
                alt="DevBubble Logo" 
                className="h-10 w-10 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              />
            </div>
            
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5 mr-4">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-5 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <a 
              href="#contact"
              className="relative overflow-hidden group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Vamos Conversar
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-4 right-4 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden md:hidden"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block mt-4 px-4 py-3 bg-indigo-600 text-white text-center rounded-xl font-bold shadow-lg shadow-indigo-500/25"
            >
              Iniciar Projeto
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
