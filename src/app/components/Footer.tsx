import image_193419c6de1b4b11f7fa881c7441e1527721a51d from '../../assets/193419c6de1b4b11f7fa881c7441e1527721a51d.png'
import { Instagram, Linkedin } from "lucide-react";
import logo from "../../assets/82ab46cf0fac37a755e21a52f3dede7f1e1747aa.png";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 transition-opacity rounded-full" />
              <img
                src={image_193419c6de1b4b11f7fa881c7441e1527721a51d}
                alt="Logo"
                className="h-10 w-10 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>

          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Desenvolvido com Bubble + React + IA.
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/giorgioderico/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/arte.inovacao.dev/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
