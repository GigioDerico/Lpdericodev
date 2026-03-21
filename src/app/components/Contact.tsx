import { motion } from "motion/react";
import { useIntegrations, trackConversion } from "../hooks/useIntegrations";
import {
  PAGE_CTA_DEFAULTS,
  PAGE_CTA_KEYS,
  getIconComponent,
  isExternalHttpLink,
  normalizeCtaHref,
  resolveIconKey,
} from "../lib/pageCtas";

export function Contact() {
  const { settings } = useIntegrations();

  const emailLabel = settings[PAGE_CTA_KEYS.contactEmail.label] ?? PAGE_CTA_DEFAULTS.contactEmail.label;
  const emailHref = normalizeCtaHref(
    settings[PAGE_CTA_KEYS.contactEmail.href] ?? PAGE_CTA_DEFAULTS.contactEmail.href
  );
  const emailIconKey = resolveIconKey(
    settings[PAGE_CTA_KEYS.contactEmail.icon],
    PAGE_CTA_DEFAULTS.contactEmail.icon
  );

  const whatsappLabel = settings[PAGE_CTA_KEYS.contactWhatsapp.label] ?? PAGE_CTA_DEFAULTS.contactWhatsapp.label;
  const whatsappHref = normalizeCtaHref(
    settings[PAGE_CTA_KEYS.contactWhatsapp.href] ?? PAGE_CTA_DEFAULTS.contactWhatsapp.href
  );
  const whatsappIconKey = resolveIconKey(
    settings[PAGE_CTA_KEYS.contactWhatsapp.icon],
    PAGE_CTA_DEFAULTS.contactWhatsapp.icon
  );

  const EmailIcon = getIconComponent(emailIconKey);
  const WhatsappIcon = getIconComponent(whatsappIconKey);

  const emailOpensNewTab = isExternalHttpLink(emailHref);
  const whatsappOpensNewTab = isExternalHttpLink(whatsappHref);

  const adsConversionTarget =
    settings.google_ads_id && settings.google_ads_conversion_label
      ? `${settings.google_ads_id}/${settings.google_ads_conversion_label}`
      : undefined;

  function handleWhatsAppClick() {
    trackConversion("cta_contact_whatsapp", adsConversionTarget);
  }

  function handlePrimaryContactClick() {
    trackConversion("cta_contact_primary", adsConversionTarget);
  }

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
              href={emailHref}
              target={emailOpensNewTab ? "_blank" : undefined}
              rel={emailOpensNewTab ? "noopener noreferrer" : undefined}
              onClick={handlePrimaryContactClick}
              className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl transition-all border border-slate-700 group cursor-pointer"
            >
              {EmailIcon ? (
                <EmailIcon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              ) : null}
              <span className="font-semibold">{emailLabel}</span>
            </a>

            <a
              href={whatsappHref}
              target={whatsappOpensNewTab ? "_blank" : undefined}
              rel={whatsappOpensNewTab ? "noopener noreferrer" : undefined}
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 group"
            >
              {WhatsappIcon ? (
                <WhatsappIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : null}
              <span className="font-semibold">{whatsappLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
