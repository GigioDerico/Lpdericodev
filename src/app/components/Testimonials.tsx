import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sql } from "../../lib/neon";
import { useIntegrations, trackConversion } from "../hooks/useIntegrations";
import {
  PAGE_CTA_DEFAULTS,
  PAGE_CTA_KEYS,
  getIconComponent,
  isExternalHttpLink,
  normalizeCtaHref,
  resolveIconKey,
} from "../lib/pageCtas";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  image_url: string | null;
  rating: number;
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg"
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg"
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings: integrationSettings } = useIntegrations();

  const adsConversionTarget =
    integrationSettings.google_ads_id && integrationSettings.google_ads_conversion_label
      ? `${integrationSettings.google_ads_id}/${integrationSettings.google_ads_conversion_label}`
      : undefined;

  const testimonialsPrimaryLabel =
    integrationSettings[PAGE_CTA_KEYS.testimonialsPrimary.label] ?? PAGE_CTA_DEFAULTS.testimonialsPrimary.label;
  const testimonialsPrimaryHref = normalizeCtaHref(
    integrationSettings[PAGE_CTA_KEYS.testimonialsPrimary.href] ?? PAGE_CTA_DEFAULTS.testimonialsPrimary.href
  );
  const testimonialsPrimaryIconKey = resolveIconKey(
    integrationSettings[PAGE_CTA_KEYS.testimonialsPrimary.icon],
    PAGE_CTA_DEFAULTS.testimonialsPrimary.icon
  );
  const TestimonialsPrimaryIcon = getIconComponent(testimonialsPrimaryIconKey);
  const primaryOpensNewTab = isExternalHttpLink(testimonialsPrimaryHref);

  const testimonialsSecondaryLabel =
    integrationSettings[PAGE_CTA_KEYS.testimonialsSecondary.label] ?? PAGE_CTA_DEFAULTS.testimonialsSecondary.label;
  const testimonialsSecondaryHref = normalizeCtaHref(
    integrationSettings[PAGE_CTA_KEYS.testimonialsSecondary.href] ?? PAGE_CTA_DEFAULTS.testimonialsSecondary.href
  );
  const testimonialsSecondaryIconKey = resolveIconKey(
    integrationSettings[PAGE_CTA_KEYS.testimonialsSecondary.icon],
    PAGE_CTA_DEFAULTS.testimonialsSecondary.icon
  );
  const TestimonialsSecondaryIcon = getIconComponent(testimonialsSecondaryIconKey);
  const secondaryOpensNewTab = isExternalHttpLink(testimonialsSecondaryHref);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!sql) {
        setLoading(false);
        return;
      }

      try {
        const result = await sql`
          SELECT id, name, text, photo_url, rating
          FROM public.testimonials
          ORDER BY created_at DESC
        `;
        setReviews(result.map((r: any) => ({
          ...r,
          image_url: r.photo_url // Map database column to component prop
        })) as Testimonial[]);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const slidesToShow = Math.min(reviews.length, 3);

  const carouselSettings = {
    dots: true,
    infinite: reviews.length > 1,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: reviews.length > 1,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(reviews.length, 2),
          slidesToScroll: 1,
          arrows: reviews.length > 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ],
    appendDots: (dots: any) => (
      <div style={{ bottom: "-40px" }}>
        <ul className="flex justify-center gap-2 custom-dots"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-slate-800 hover:bg-indigo-500 transition-colors cursor-pointer" />
    )
  };

  function handlePrimaryCtaClick() {
    trackConversion("cta_testimonials_primary", adsConversionTarget);
  }

  function handleSecondaryCtaClick() {
    trackConversion("cta_testimonials_secondary", adsConversionTarget);
  }

  if (loading) {
    return (
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }

  const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length;

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Global styles for slick dots active state override */}
      <style>{`
        .slick-dots li.slick-active div {
          background-color: #6366f1 !important;
          transform: scale(1.2);
        }
        .slick-track {
          display: flex !important;
          gap: 0; 
        }
        .slick-slide {
          height: auto;
          padding: 0 4px;
        }
        .slick-slide > div {
          height: 100%;
        }
        @media (min-width: 768px) {
          .slick-slide {
            padding: 0 12px;
          }
        }
        .slick-list {
          overflow: hidden;
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-indigo-400 font-medium text-sm tracking-wider uppercase">Avaliações</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            O que nossos clientes dizem
          </h2>

          <div className="flex items-center justify-center gap-4 text-slate-300">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(Math.round(avgRating))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-white">{avgRating.toFixed(1)}</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full" />
            <span>{reviews.length} {reviews.length === 1 ? "Avaliação" : "Avaliações"}</span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="mb-16 md:mb-24 px-0 md:px-8">
          <Slider {...carouselSettings}>
            {reviews.map((review, index) => (
              <div key={review.id} className="h-full pt-2 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 p-5 md:p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col h-full relative group min-h-[260px] md:min-h-[320px]"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800 group-hover:text-indigo-500/20 transition-colors" />

                  <div className="flex text-yellow-500 mb-6">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-300 mb-8 flex-grow leading-relaxed line-clamp-6">
                    "{review.text}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all">
                      {review.image_url ? (
                        <img
                          src={review.image_url}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-xs font-bold">
                          {getInitials(review.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{review.name}</div>
                      <div className="text-xs text-slate-500">Cliente Verificado</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para ser o próximo caso de sucesso?
            </h3>
            <p className="text-slate-400 mb-8 text-lg">
              Junte-se aos nossos clientes satisfeitos e transforme sua ideia em realidade.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={testimonialsPrimaryHref}
                target={primaryOpensNewTab ? "_blank" : undefined}
                rel={primaryOpensNewTab ? "noopener noreferrer" : undefined}
                onClick={handlePrimaryCtaClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {testimonialsPrimaryLabel}
                {TestimonialsPrimaryIcon ? <TestimonialsPrimaryIcon className="w-4 h-4" /> : null}
              </a>
              <a
                href={testimonialsSecondaryHref}
                target={secondaryOpensNewTab ? "_blank" : undefined}
                rel={secondaryOpensNewTab ? "noopener noreferrer" : undefined}
                onClick={handleSecondaryCtaClick}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
              >
                {TestimonialsSecondaryIcon ? <TestimonialsSecondaryIcon className="w-4 h-4" /> : null}
                {testimonialsSecondaryLabel}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
