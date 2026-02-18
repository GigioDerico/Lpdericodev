import { useEffect, useState } from "react";
import { SettingsService, type SiteSetting } from "../../lib/services";

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

export function IntegrationScripts({ settings }: { settings: Record<string, string> }) {
    useEffect(() => {
        // Google Analytics 4
        const ga4Id = settings.ga4_id;
        if (ga4Id && ga4Id.startsWith("G-")) {
            if (!document.getElementById("ga4-script")) {
                const script = document.createElement("script");
                script.id = "ga4-script";
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
                document.head.appendChild(script);

                const inline = document.createElement("script");
                inline.id = "ga4-inline";
                inline.textContent = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${ga4Id}');
                `;
                document.head.appendChild(inline);
            }
        }

        // Meta Pixel (Facebook)
        const pixelId = settings.pixel_id;
        if (pixelId && pixelId.length > 5) {
            if (!document.getElementById("meta-pixel-script")) {
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
        }

        // Hotjar
        const hotjarId = settings.hotjar_id;
        if (hotjarId && hotjarId.length > 3) {
            if (!document.getElementById("hotjar-script")) {
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
        }
    }, [settings]);

    return null;
}
