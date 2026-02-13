import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function TechStack() {
  const stack = [
    { name: "Bubble.io", role: "Frontend & Logic", color: "text-indigo-400" },
    { name: "Supabase", role: "Backend & Database", color: "text-green-400" },
    { name: "n8n", role: "Automation & Workflows", color: "text-red-400" },
    { name: "OpenAI / Gemini", role: "AI Intelligence", color: "text-purple-400" },
    { name: "REST APIs", role: "Integrations", color: "text-blue-400" },
    { name: "Stripe / Gateways", role: "Payments", color: "text-cyan-400" },
  ];

  return (
    <section className="py-20 bg-slate-950 border-y border-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Especialista em <span className="text-indigo-500">Bubble + AI Coding</span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Hoje desenvolvo sistemas que combinam NoCode + Backend estruturado + Inteligência Artificial, entregando soluções modernas com muito mais velocidade e menor custo.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Base NoCode Sólida</h4>
                  <p className="text-slate-400 text-sm">Desenvolvimento ágil sem sacrificar a qualidade.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Backend Híbrido</h4>
                  <p className="text-slate-400 text-sm">Integração com bancos SQL para performance massiva.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Automação Inteligente</h4>
                  <p className="text-slate-400 text-sm">Workflows complexos rodando em background via n8n.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stack.map((item, index) => (
              <div 
                key={index}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all hover:-translate-y-1"
              >
                <div className={`font-bold text-xl mb-1 ${item.color}`}>{item.name}</div>
                <div className="text-slate-500 text-sm">{item.role}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
