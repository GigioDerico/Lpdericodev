import { useEffect, useState } from "react";
import { SettingsService, type SiteSetting } from "../../lib/services";

// ─── Types ───────────────────────────────────────────────────────────────────

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIntegrations() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loaded, setLoaded] = useState(false);

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
                console.error("Failed to load integrations:", error);
            } finally {
                setLoaded(true);
            }
        }
        load();
    }, []);

    return { settings, loaded };
}

// ─── Conversion Tracker ──────────────────────────────────────────────────────

/**
 * Envia evento de conversão para GA4 e Google Ads.
 * Chame esta função nos cliques de CTA importantes.
 */
export function trackConversion(
    eventName: string,
    adsConversionLabel?: string
) {
    if (typeof window.gtag !== "function") return;

    // Evento GA4
    window.gtag("event", eventName, {
        event_category: "engagement",
        event_label: eventName,
    });

    // Conversão Google Ads (se label configurado)
    if (adsConversionLabel) {
        window.gtag("event", "conversion", {
            send_to: adsConversionLabel,
        });
    }
}

// ─── Integration Scripts ─────────────────────────────────────────────────────

export function IntegrationScripts({
    settings,
}: {
    settings: Record<string, string>;
}) {
    useEffect(() => {
        const ga4Id = settings.ga4_id;
        const adsId = settings.google_ads_id;
        const hasMeasurement = (ga4Id && ga4Id.startsWith("G-")) || (adsId && adsId.startsWith("AW-"));

        // ── Google Tags (GA4 + Google Ads compartilham o mesmo gtag.js) ──────
        if (hasMeasurement && !document.getElementById("gtag-script")) {
            // Usa GA4 id como base, senão o Ads id
            const tagId = ga4Id?.startsWith("G-") ? ga4Id : adsId;

            const script = document.createElement("script");
            script.id = "gtag-script";
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
            document.head.appendChild(script);

            const inline = document.createElement("script");
            inline.id = "gtag-inline";
            inline.textContent = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${ga4Id?.startsWith("G-") ? `gtag('config', '${ga4Id}');` : ""}
                ${adsId?.startsWith("AW-") ? `gtag('config', '${adsId}');` : ""}
            `;
            document.head.appendChild(inline);
        }

        // ── Meta Pixel (Facebook) ─────────────────────────────────────────────
        const pixelId = settings.pixel_id;
        if (pixelId && pixelId.length > 5 && !document.getElementById("meta-pixel-script")) {
            const script = document.createElement("script");
            script.id = "meta-pixel-script";
            script.textContent = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
            `;
            document.head.appendChild(script);
        }

        // ── Hotjar ───────────────────────────────────────────────────────────
        const hotjarId = settings.hotjar_id;
        if (hotjarId && hotjarId.length > 3 && !document.getElementById("hotjar-script")) {
            const script = document.createElement("script");
            script.id = "hotjar-script";
            script.textContent = `
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${hotjarId},hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `;
            document.head.appendChild(script);
        }
    }, [settings]);

    return null;
}
