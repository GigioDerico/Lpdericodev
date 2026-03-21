import type { ComponentType } from "react";
import { ArrowRight, Mail, MessageSquare, Phone, Send, Share2 } from "lucide-react";

export type IconKey = "Mail" | "MessageSquare" | "ArrowRight" | "Phone" | "Send" | "Share2" | "none";
export type PageCtaId =
    | "heroPrimary"
    | "testimonialsPrimary"
    | "testimonialsSecondary"
    | "contactEmail"
    | "contactWhatsapp";

export interface CtaConfig {
    label: string;
    icon: IconKey;
    href: string;
}

export interface HeroContentConfig {
    titleLine1: string;
    titleLine2: string;
    description: string;
}

export interface CtaFieldKeys {
    label: string;
    icon: string;
    href: string;
}

type IconComponent = ComponentType<{ className?: string }>;

const ICON_MAP: Record<Exclude<IconKey, "none">, IconComponent> = {
    Mail,
    MessageSquare,
    ArrowRight,
    Phone,
    Send,
    Share2,
};

export const ICON_OPTIONS: Array<{ value: IconKey; label: string; Icon: IconComponent | null }> = [
    { value: "Mail", label: "Mail", Icon: Mail },
    { value: "MessageSquare", label: "MessageSquare", Icon: MessageSquare },
    { value: "ArrowRight", label: "ArrowRight", Icon: ArrowRight },
    { value: "Phone", label: "Phone", Icon: Phone },
    { value: "Send", label: "Send", Icon: Send },
    { value: "Share2", label: "Share2", Icon: Share2 },
    { value: "none", label: "Sem ícone", Icon: null },
];

export const PAGE_CTA_KEYS: Record<PageCtaId, CtaFieldKeys> = {
    heroPrimary: {
        label: "components.hero.cta.primary.label",
        icon: "components.hero.cta.primary.icon",
        href: "components.hero.cta.primary.href",
    },
    testimonialsPrimary: {
        label: "components.testimonials.cta.primary.label",
        icon: "components.testimonials.cta.primary.icon",
        href: "components.testimonials.cta.primary.href",
    },
    testimonialsSecondary: {
        label: "components.testimonials.cta.secondary.label",
        icon: "components.testimonials.cta.secondary.icon",
        href: "components.testimonials.cta.secondary.href",
    },
    contactEmail: {
        label: "components.contact.cta.email.label",
        icon: "components.contact.cta.email.icon",
        href: "components.contact.cta.email.href",
    },
    contactWhatsapp: {
        label: "components.contact.cta.whatsapp.label",
        icon: "components.contact.cta.whatsapp.icon",
        href: "components.contact.cta.whatsapp.href",
    },
};

export const PAGE_CTA_DEFAULTS: Record<PageCtaId, CtaConfig> = {
    heroPrimary: {
        label: "Iniciar Projeto",
        icon: "ArrowRight",
        href: "https://wa.me/5511976019844?text=Vim%20do%20site%20Derico%20Dev%20e%20quero%20mais%20informações%20sobre%20desenvolvimento%20de%20aplicativos.",
    },
    testimonialsPrimary: {
        label: "Iniciar Meu Projeto",
        icon: "ArrowRight",
        href: "#contact",
    },
    testimonialsSecondary: {
        label: "Falar com Especialista",
        icon: "MessageSquare",
        href: "#contact",
    },
    contactEmail: {
        label: "Enviar E-mail",
        icon: "Mail",
        href: "mailto:giorgio@arteinovacao.com.br?subject=Quero%20mais%20informações%20sobre%20desenvolvimento%20de%20aplicativos",
    },
    contactWhatsapp: {
        label: "Chamar no WhatsApp",
        icon: "MessageSquare",
        href: "https://wa.me/5511976019844?text=Vim%20do%20site%20Derico%20Dev%20e%20quero%20mais%20informações%20sobre%20desenvolvimento%20de%20aplicativos.",
    },
};

export const HERO_CONTENT_KEYS = {
    titleLine1: "components.hero.content.title_line_1",
    titleLine2: "components.hero.content.title_line_2",
    description: "components.hero.content.description",
} as const;

export const HERO_CONTENT_DEFAULTS: HeroContentConfig = {
    titleLine1: "Arquiteto",
    titleLine2: "Full Stack",
    description:
        "Especialista em aplicações Bubble.io de alta performance integradas com IA e Supabase. Construo produtos digitais escaláveis, não apenas telas.",
};

export function resolveIconKey(value: string | undefined, fallback: IconKey): IconKey {
    if (!value) return fallback;
    return ICON_OPTIONS.some((option) => option.value === value) ? (value as IconKey) : fallback;
}

export function getIconComponent(icon: IconKey): IconComponent | null {
    if (icon === "none") return null;
    return ICON_MAP[icon];
}

export function isExternalHttpLink(href: string): boolean {
    return /^https?:\/\//i.test(href.trim());
}

export function normalizeCtaHref(rawHref: string): string {
    const href = rawHref.trim();
    if (!href) return "#";

    if (
        href.startsWith("#") ||
        href.startsWith("/") ||
        /^https?:\/\//i.test(href) ||
        /^mailto:/i.test(href) ||
        /^tel:/i.test(href)
    ) {
        return href;
    }

    if (/^(www\.|wa\.me\/|api\.whatsapp\.com\/)/i.test(href)) {
        return `https://${href}`;
    }

    if (/^[a-z0-9.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(href)) {
        return `https://${href}`;
    }

    return href;
}
