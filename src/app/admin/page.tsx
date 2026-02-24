import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Loader2, FolderGit2, MessageSquare } from "lucide-react";

interface DashboardStats {
    projectsCount: number;
    testimonialsCount: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();

                setStats({
                    projectsCount: data.projectsCount ?? 0,
                    testimonialsCount: data.testimonialsCount ?? 0,
                });
            } catch (err: any) {
                console.error("Dashboard fetch error:", err);
                setError("Erro ao carregar estatísticas.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400">Visão geral do seu portfólio.</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Visão geral do seu portfólio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Projetos"
                    value={stats?.projectsCount ?? 0}
                    icon={<FolderGit2 />}
                    color="text-indigo-400"
                    bgColor="bg-indigo-500/10"
                />
                <StatCard
                    title="Depoimentos"
                    value={stats?.testimonialsCount ?? 0}
                    icon={<MessageSquare />}
                    color="text-cyan-400"
                    bgColor="bg-cyan-500/10"
                />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickAction
                        label="Gerenciar Projetos"
                        description="Adicionar, editar ou remover projetos do portfólio"
                        href="/admin/projects"
                        color="indigo"
                    />
                    <QuickAction
                        label="Gerenciar Depoimentos"
                        description="Adicionar, editar ou remover depoimentos de clientes"
                        href="/admin/testimonials"
                        color="cyan"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, bgColor }: {
    title: string; value: number; icon: React.ReactNode; color: string; bgColor: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 ${bgColor} rounded-lg ${color}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                    <span className="text-3xl font-bold text-white">{value}</span>
                </div>
            </div>
        </motion.div>
    );
}

function QuickAction({ label, description, href, color }: {
    label: string; description: string; href: string; color: string;
}) {
    const colors: Record<string, string> = {
        indigo: "hover:border-indigo-500/30 hover:bg-indigo-500/5",
        cyan: "hover:border-cyan-500/30 hover:bg-cyan-500/5",
    };

    return (
        <a
            href={href}
            className={`block p-4 border border-slate-800 rounded-lg transition-all ${colors[color]}`}
        >
            <h3 className="text-white font-medium mb-1">{label}</h3>
            <p className="text-slate-500 text-sm">{description}</p>
        </a>
    );
}
