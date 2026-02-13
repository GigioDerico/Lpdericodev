import { motion } from "motion/react";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-950 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-900 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para tirar sua ideia do papel?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Se você precisa transformar uma ideia em um sistema real, funcional e estruturado, eu posso construir isso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="mailto:contact@example.com" 
              className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl transition-all border border-slate-700 group"
            >
              <Mail className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Enviar E-mail</span>
            </a>
            
            <a 
              href="#" 
              className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 group"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Chamar no WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
