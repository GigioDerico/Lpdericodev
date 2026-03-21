import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
    Loader2,
    Save,
    LayoutGrid,
    SplitSquareHorizontal,
    Type,
    Link as LinkIcon,
    MessageSquare,
    Mail,
} from "lucide-react";
import { toast } from "sonner";
import { SettingsService, type SiteSetting } from "../../../lib/services";
import {
    HERO_CONTENT_DEFAULTS,
    HERO_CONTENT_KEYS,
    ICON_OPTIONS,
    PAGE_CTA_DEFAULTS,
    PAGE_CTA_KEYS,
    type CtaConfig,
    type HeroContentConfig,
    type IconKey,
    type PageCtaId,
    resolveIconKey,
} from "../../lib/pageCtas";

type TabId = "hero" | "testimonials" | "contact" | "header";

const CTA_IDS: PageCtaId[] = [
    "heroPrimary",
    "testimonialsPrimary",
    "testimonialsSecondary",
    "contactEmail",
    "contactWhatsapp",
];

const SAVE_DESCRIPTIONS: Record<PageCtaId, { label: string; icon: string; href: string }> = {
    heroPrimary: {
        label: "Label visível do botão principal do Hero",
        icon: "Ícone do botão principal do Hero",
        href: "Link (href) do botão principal do Hero",
    },
    testimonialsPrimary: {
        label: "Label visível do botão principal de Testimonials",
        icon: "Ícone do botão principal de Testimonials",
        href: "Link (href) do botão principal de Testimonials",
    },
    testimonialsSecondary: {
        label: "Label visível do botão secundário de Testimonials",
        icon: "Ícone do botão secundário de Testimonials",
        href: "Link (href) do botão secundário de Testimonials",
    },
    contactEmail: {
        label: "Label visível do botão primário (Contato)",
        icon: "Ícone do botão primário (Contato)",
        href: "Link (href) do botão primário (Contato)",
    },
    contactWhatsapp: {
        label: "Label visível do botão de WhatsApp (Contato)",
        icon: "Ícone do botão de WhatsApp (Contato)",
        href: "Link (href) do botão de WhatsApp (Contato)",
    },
};

function buildInitialCtas(settings: Record<string, string>): Record<PageCtaId, CtaConfig> {
    return CTA_IDS.reduce(
        (acc, id) => {
            const keys = PAGE_CTA_KEYS[id];
            const defaults = PAGE_CTA_DEFAULTS[id];
            acc[id] = {
                label: settings[keys.label] ?? defaults.label,
                icon: resolveIconKey(settings[keys.icon], defaults.icon),
                href: settings[keys.href] ?? defaults.href,
            };
            return acc;
        },
        {} as Record<PageCtaId, CtaConfig>
    );
}

export default function PageComponentsAdmin() {
    const [activeTab, setActiveTab] = useState<TabId>("hero");
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [ctas, setCtas] = useState<Record<PageCtaId, CtaConfig>>(buildInitialCtas({}));
    const [heroContent, setHeroContent] = useState<HeroContentConfig>(HERO_CONTENT_DEFAULTS);

    const pageTabs = useMemo(
        () =>
            [
                { id: "hero" as const, label: "Hero" },
                { id: "testimonials" as const, label: "Testimonials" },
                { id: "contact" as const, label: "Contato" },
                { id: "header" as const, label: "Header (em breve)" },
            ] as const,
        []
    );

    useEffect(() => {
        async function load() {
            try {
                const rows = await SettingsService.getAll();
                const map: Record<string, string> = {};
                rows.forEach((row: SiteSetting) => {
                    map[row.key] = row.value;
                });
                setSettings(map);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar componentes da página.");
            } finally {
                setLoaded(true);
            }
        }

        load();
    }, []);

    useEffect(() => {
        if (!loaded) return;
        setCtas(buildInitialCtas(settings));
        setHeroContent({
            titleLine1: settings[HERO_CONTENT_KEYS.titleLine1] ?? HERO_CONTENT_DEFAULTS.titleLine1,
            titleLine2: settings[HERO_CONTENT_KEYS.titleLine2] ?? HERO_CONTENT_DEFAULTS.titleLine2,
            description: settings[HERO_CONTENT_KEYS.description] ?? HERO_CONTENT_DEFAULTS.description,
        });
    }, [loaded, settings]);

    function updateCtaLabel(id: PageCtaId, value: string) {
        setCtas((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                label: value,
            },
        }));
    }

    function updateCtaIcon(id: PageCtaId, value: IconKey) {
        setCtas((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                icon: value,
            },
        }));
    }

    function updateCtaHref(id: PageCtaId, value: string) {
        setCtas((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                href: value,
            },
        }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const updates = CTA_IDS.flatMap((id) => {
                const keys = PAGE_CTA_KEYS[id];
                const values = ctas[id];
                const descriptions = SAVE_DESCRIPTIONS[id];
                return [
                    SettingsService.upsert(keys.label, values.label, descriptions.label),
                    SettingsService.upsert(keys.icon, values.icon, descriptions.icon),
                    SettingsService.upsert(keys.href, values.href, descriptions.href),
                ];
            });

            await Promise.all([
                ...updates,
                SettingsService.upsert(
                    HERO_CONTENT_KEYS.titleLine1,
                    heroContent.titleLine1,
                    "Título principal da Hero (linha 1)"
                ),
                SettingsService.upsert(
                    HERO_CONTENT_KEYS.titleLine2,
                    heroContent.titleLine2,
                    "Título principal da Hero (linha destacada)"
                ),
                SettingsService.upsert(
                    HERO_CONTENT_KEYS.description,
                    heroContent.description,
                    "Descrição padrão da Hero"
                ),
            ]);
            toast.success("Componentes da página salvos com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar componentes da página.");
        } finally {
            setSaving(false);
        }
    }

    if (!loaded) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                        <LayoutGrid size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Componentes da Página</h1>
                        <p className="text-slate-400 mt-1">Edite label, ícone e link dos botões CTA da página inicial.</p>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
            >
                <div className="flex flex-wrap items-center gap-2 mb-5">
                    {pageTabs.map((tab) => {
                        const isActive = tab.id === activeTab;
                        const isPlaceholder = tab.id === "header";
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                disabled={isPlaceholder}
                                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                    isActive
                                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                                        : "bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:border-slate-700"
                                } ${isPlaceholder ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === "header" ? (
                    <div className="text-slate-400 text-sm">Em breve: edição dos CTAs do Header.</div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                        {activeTab === "hero" ? (
                            <>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                            <SplitSquareHorizontal size={18} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">Hero</h2>
                                            <p className="text-sm text-slate-500">
                                                Conteúdo principal e botão de abertura da página.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <HeroContentEditor
                                        titleLine1={heroContent.titleLine1}
                                        onChangeTitleLine1={(v) =>
                                            setHeroContent((prev) => ({ ...prev, titleLine1: v }))
                                        }
                                        titleLine2={heroContent.titleLine2}
                                        onChangeTitleLine2={(v) =>
                                            setHeroContent((prev) => ({ ...prev, titleLine2: v }))
                                        }
                                        description={heroContent.description}
                                        onChangeDescription={(v) =>
                                            setHeroContent((prev) => ({ ...prev, description: v }))
                                        }
                                    />
                                    <CTAEditor
                                        title="Iniciar Projeto"
                                        subtitle="Botão principal do Hero"
                                        icon={<LinkIcon size={16} />}
                                        label={ctas.heroPrimary.label}
                                        onChangeLabel={(v) => updateCtaLabel("heroPrimary", v)}
                                        iconKey={ctas.heroPrimary.icon}
                                        onChangeIcon={(v) => updateCtaIcon("heroPrimary", v)}
                                        href={ctas.heroPrimary.href}
                                        onChangeHref={(v) => updateCtaHref("heroPrimary", v)}
                                    />
                                </div>
                            </>
                        ) : null}

                        {activeTab === "testimonials" ? (
                            <>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                            <SplitSquareHorizontal size={18} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">Testimonials</h2>
                                            <p className="text-sm text-slate-500">
                                                Botões de ação ao final da seção de avaliações.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CTAEditor
                                        title="Iniciar Meu Projeto"
                                        subtitle="Botão principal dos Testimonials"
                                        icon={<Type size={16} />}
                                        label={ctas.testimonialsPrimary.label}
                                        onChangeLabel={(v) => updateCtaLabel("testimonialsPrimary", v)}
                                        iconKey={ctas.testimonialsPrimary.icon}
                                        onChangeIcon={(v) => updateCtaIcon("testimonialsPrimary", v)}
                                        href={ctas.testimonialsPrimary.href}
                                        onChangeHref={(v) => updateCtaHref("testimonialsPrimary", v)}
                                    />
                                    <CTAEditor
                                        title="Falar com Especialista"
                                        subtitle="Botão secundário dos Testimonials"
                                        icon={<MessageSquare size={16} />}
                                        label={ctas.testimonialsSecondary.label}
                                        onChangeLabel={(v) => updateCtaLabel("testimonialsSecondary", v)}
                                        iconKey={ctas.testimonialsSecondary.icon}
                                        onChangeIcon={(v) => updateCtaIcon("testimonialsSecondary", v)}
                                        href={ctas.testimonialsSecondary.href}
                                        onChangeHref={(v) => updateCtaHref("testimonialsSecondary", v)}
                                    />
                                </div>
                            </>
                        ) : null}

                        {activeTab === "contact" ? (
                            <>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                            <SplitSquareHorizontal size={18} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">Contato</h2>
                                            <p className="text-sm text-slate-500">
                                                Botões de conversão da seção de contato.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CTAEditor
                                        title="CTA Primário"
                                        subtitle="Primeiro botão da seção Contato"
                                        icon={<Mail size={16} />}
                                        label={ctas.contactEmail.label}
                                        onChangeLabel={(v) => updateCtaLabel("contactEmail", v)}
                                        iconKey={ctas.contactEmail.icon}
                                        onChangeIcon={(v) => updateCtaIcon("contactEmail", v)}
                                        href={ctas.contactEmail.href}
                                        onChangeHref={(v) => updateCtaHref("contactEmail", v)}
                                    />
                                    <CTAEditor
                                        title="Chamar no WhatsApp"
                                        subtitle="Botão de WhatsApp"
                                        icon={<LinkIcon size={16} />}
                                        label={ctas.contactWhatsapp.label}
                                        onChangeLabel={(v) => updateCtaLabel("contactWhatsapp", v)}
                                        iconKey={ctas.contactWhatsapp.icon}
                                        onChangeIcon={(v) => updateCtaIcon("contactWhatsapp", v)}
                                        href={ctas.contactWhatsapp.href}
                                        onChangeHref={(v) => updateCtaHref("contactWhatsapp", v)}
                                    />
                                </div>
                            </>
                        ) : null}

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Salvar CTAs
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}

function HeroContentEditor({
    titleLine1,
    onChangeTitleLine1,
    titleLine2,
    onChangeTitleLine2,
    description,
    onChangeDescription,
}: {
    titleLine1: string;
    onChangeTitleLine1: (v: string) => void;
    titleLine2: string;
    onChangeTitleLine2: (v: string) => void;
    description: string;
    onChangeDescription: (v: string) => void;
}) {
    return (
        <div className="bg-slate-950/30 border border-slate-800 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                    <Type size={16} />
                </div>
                <div>
                    <h3 className="text-white font-semibold">Texto da Hero</h3>
                    <p className="text-xs text-slate-500">Título e descrição destacados no topo da página.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Título (linha 1)
                    </label>
                    <input
                        type="text"
                        value={titleLine1}
                        onChange={(e) => onChangeTitleLine1(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Título (linha destacada)
                    </label>
                    <input
                        type="text"
                        value={titleLine2}
                        onChange={(e) => onChangeTitleLine2(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Texto padrão
                    </label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => onChangeDescription(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm resize-y"
                    />
                </div>
            </div>
        </div>
    );
}

function CTAEditor({
    title,
    subtitle,
    icon,
    label,
    onChangeLabel,
    iconKey,
    onChangeIcon,
    href,
    onChangeHref,
}: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    label: string;
    onChangeLabel: (v: string) => void;
    iconKey: IconKey;
    onChangeIcon: (v: IconKey) => void;
    href: string;
    onChangeHref: (v: string) => void;
}) {
    return (
        <div className="bg-slate-950/30 border border-slate-800 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <h3 className="text-white font-semibold">{title}</h3>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => onChangeLabel(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ícone</label>
                    <select
                        value={iconKey}
                        onChange={(e) => onChangeIcon(e.target.value as IconKey)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    >
                        {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Link (href)</label>
                    <input
                        type="text"
                        value={href}
                        onChange={(e) => onChangeHref(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
