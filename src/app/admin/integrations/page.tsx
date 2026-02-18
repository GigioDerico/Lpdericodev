import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    Save,
    Loader2,
    BarChart3,
    Eye,
    Share2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SettingsService, type SiteSetting } from "../../../lib/services";

interface IntegrationField {
    key: string;
    label: string;
    placeholder: string;
    description: string;
    icon: React.ReactNode;
    group: string;
}

const INTEGRATION_FIELDS: IntegrationField[] = [
    {
        key: "ga4_id",
        label: "Google Analytics 4",
        placeholder: "G-XXXXXXXXXX",
        description: "ID de Medição do GA4 para rastrear visitas e comportamento dos usuários.",
        icon: <BarChart3 size={20} />,
        group: "analytics",
    },
    {
        key: "pixel_id",
        label: "Meta Pixel (Facebook)",
        placeholder: "1234567890",
        description: "ID do Pixel para rastrear conversões e criar públicos no Facebook/Instagram.",
        icon: <Eye size={20} />,
        group: "analytics",
    },
    {
        key: "hotjar_id",
        label: "Hotjar",
        placeholder: "1234567",
        description: "ID do site no Hotjar para mapas de calor e gravações de sessão.",
        icon: <Eye size={20} />,
        group: "analytics",
    },
    {
        key: "site_url",
        label: "URL do Site",
        placeholder: "https://dericodev.com.br",
        description: "Domínio principal usado para SEO (canonical, sitemap).",
        icon: <Share2 size={20} />,
        group: "seo",
    },
    {
        key: "whatsapp_number",
        label: "WhatsApp",
        placeholder: "5511999999999",
        description: "Número com código do país para botões de contato via WhatsApp.",
        icon: <Share2 size={20} />,
        group: "contact",
    },
];

export default function AdminIntegrations() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            const rows = await SettingsService.getAll();
            const map: Record<string, string> = {};
            rows.forEach((row: SiteSetting) => {
                map[row.key] = row.value;
            });
            setSettings(map);
        } catch (error) {
            toast.error("Erro ao carregar configurações.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(key: string, value: string) {
        setSettings((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const promises = INTEGRATION_FIELDS.map((field) =>
                SettingsService.upsert(
                    field.key,
                    settings[field.key] || "",
                    field.description
                )
            );
            await Promise.all(promises);
            toast.success("Integrações salvas com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar integrações.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    const groups = [
        {
            id: "analytics",
            title: "Analytics & Rastreamento",
            description: "Configure ferramentas de análise de tráfego e comportamento.",
            color: "indigo",
        },
        {
            id: "seo",
            title: "SEO",
            description: "Configurações para otimização de motores de busca.",
            color: "emerald",
        },
        {
            id: "contact",
            title: "Contato",
            description: "Canais de comunicação com clientes.",
            color: "cyan",
        },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Integrações</h1>
                <p className="text-slate-400 mt-1">
                    Gerencie suas chaves de API e configurações externas
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {groups.map((group, gi) => {
                    const fields = INTEGRATION_FIELDS.filter(
                        (f) => f.group === group.id
                    );
                    if (fields.length === 0) return null;

                    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                        indigo: {
                            bg: "bg-indigo-500/10",
                            border: "border-indigo-500/20",
                            text: "text-indigo-400",
                        },
                        emerald: {
                            bg: "bg-emerald-500/10",
                            border: "border-emerald-500/20",
                            text: "text-emerald-400",
                        },
                        cyan: {
                            bg: "bg-cyan-500/10",
                            border: "border-cyan-500/20",
                            text: "text-cyan-400",
                        },
                    };

                    const colors = colorMap[group.color] || colorMap.indigo;

                    return (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: gi * 0.1 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}
                                >
                                    <BarChart3
                                        className={`w-5 h-5 ${colors.text}`}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        {group.title}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {group.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {fields.map((field) => (
                                    <div key={field.key} className="space-y-2">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            value={settings[field.key] || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    field.key,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={field.placeholder}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-mono"
                                        />
                                        <p className="text-xs text-slate-600">
                                            {field.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                    >
                        {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Salvar Integrações
                    </button>
                </div>
            </form>
        </div>
    );
}
