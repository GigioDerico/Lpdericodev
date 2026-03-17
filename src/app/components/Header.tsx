import image_193419c6de1b4b11f7fa881c7441e1527721a51d from '../../assets/193419c6de1b4b11f7fa881c7441e1527721a51d.png'
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/82ab46cf0fac37a755e21a52f3dede7f1e1747aa.png";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-4" : "py-6"
        }`}
    >
      {/* Neon Glow Background Effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"
        }`}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 shadow-[0_0_20px_rgba(99,102,241,0.15)]" />
        {/* Gradient Line for Neon feel */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <nav className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-12" : "h-16"
          } bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl px-6 shadow-2xl shadow-indigo-500/10`}>

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
              <img
                src={image_193419c6de1b4b11f7fa881c7441e1527721a51d}
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
                  onClick={(e) => {
                    if (link.href === "#differentiators" && !document.getElementById("differentiators")) {
                      e.preventDefault();
                      const headings = Array.from(document.querySelectorAll("h2"));
                      const target = headings.find((h) => h.textContent?.includes("Diferencial"));
                      target?.closest("section")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="relative px-5 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/giorgioderico/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Giorgio Derico"
                className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              <a
                href="https://wa.me/5511976019844?text=Vim%20do%20site%20Derico%20Dev%20e%20quero%20mais%20infromações%20sobre%20desenvolvimento%20de%20aplicativos."
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Vamos Conversar
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
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
            <div className="flex items-center gap-4 mt-4 px-4">
              <a
                href="https://www.linkedin.com/in/giorgioderico/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Giorgio Derico"
                className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/5 border border-white/5 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://wa.me/5511976019844?text=Vim%20do%20site%20Derico%20Dev%20e%20quero%20mais%20infromações%20sobre%20desenvolvimento%20de%20aplicativos."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block flex-1 py-3 bg-indigo-600 text-white text-center rounded-xl font-bold shadow-lg shadow-indigo-500/25"
              >
                Iniciar Projeto
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
