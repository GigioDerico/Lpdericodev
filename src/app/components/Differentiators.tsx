import { motion } from "motion/react";
import { Check } from "lucide-react";

const differentials = [
  "Visão de produto",
  "Organização e arquitetura limpa",
  "Performance e escalabilidade",
  "Integrações avançadas",
  "Mentalidade orientada a negócio",
  "Entrega ágil com qualidade técnica"
];

export function Differentiators() {
  return (
    <section className="py-20 bg-indigo-900/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/80 z-0"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          Meu <span className="text-indigo-400">Diferencial</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-4xl mx-auto">
          {differentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-white font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
