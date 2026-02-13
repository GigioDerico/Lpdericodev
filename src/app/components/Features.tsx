import { motion } from "motion/react";
import { Database, Server, Workflow, Zap, DollarSign, Brain } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Banco de Dados Inteligente",
    description: "Estruturação eficiente para garantir integridade e velocidade no acesso aos dados."
  },
  {
    icon: Server,
    title: "Arquitetura Escalável",
    description: "Sistemas projetados para crescer sem perder performance ou estabilidade."
  },
  {
    icon: Workflow,
    title: "Integrações & Webhooks",
    description: "Conexão perfeita com APIs externas, gateways de pagamento e serviços terceiros."
  },
  {
    icon: Zap,
    title: "Performance Otimizada",
    description: "Workflows enxutos e carregamento rápido para melhor experiência do usuário."
  },
  {
    icon: DollarSign,
    title: "Controle de Custos",
    description: "Otimização de WUs no Bubble e uso eficiente de infraestrutura externa."
  },
  {
    icon: Brain,
    title: "Inteligência Artificial",
    description: "Integração com LLMs (OpenAI, Gemini) para funcionalidades avançadas."
  }
];

export function Features() {
  return (
    <section id="strategy" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Desenvolvimento com <span className="text-indigo-500">Estratégia</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Minha abordagem vai além do visual. Penso como desenvolvedor e como gestor de produto para entregar soluções completas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
