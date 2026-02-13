import { motion } from "motion/react";
import { Star, Quote, ArrowRight, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    name: "Heloysa Tancredo",
    text: "O Giorgio atendeu nossa empresa por vários anos e sempre demonstrou muita responsabilidade e comprometimento. É uma pessoa tranquila, confiável e muito boa de se relacionar. Um ótimo profissional, que entrega com qualidade e faz tudo com muito cuidado e seriedade. Recomendo com total confiança!",
    image: "https://images.unsplash.com/photo-1727299781147-c7ab897883a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBicmF6aWxpYW4lMjB3b21hbiUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcxMDIyMDY4fDA&ixlib=rb-4.1.0&q=80&w=200",
    initials: "HT"
  },
  {
    name: "Jota Russo",
    text: "Giorgio é diferenciado. Propõe soluções, preza pela qualidade das entregas, tem a senioridade pra resolver problemas complexos com integrações de apis de terceiros, meios de pagamento, etc. Recomendadíssimo!",
    image: "https://images.unsplash.com/photo-1769628027250-d2a7a5a4eb64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    initials: "JR"
  },
  {
    name: "Patricia dos Santos",
    text: "Empresa super competente e profissional. Indicamos muito o trabalho deles.",
    image: "https://images.unsplash.com/photo-1712168567859-e24cbc155219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    initials: "PS"
  },
  {
    name: "João Paulo Zamith",
    text: "Equipe diferenciada e atenta aos detalhes para desenvolver e atender as mais variadas necessidades em desenvolvimentos de aplicativos !!!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    initials: "JZ"
  }
];

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

export function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false // Hide arrows on mobile for better UX
        }
      }
    ],
    appendDots: (dots: any) => (
      <div style={{ bottom: "-40px" }}>
        <ul className="flex justify-center gap-2 custom-dots"> {dots} </ul>
      </div>
    ),
    customPaging: (i: any) => (
      <div className="w-2.5 h-2.5 rounded-full bg-slate-800 hover:bg-indigo-500 transition-colors cursor-pointer" />
    )
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Global styles for slick dots active state override */}
      <style>{`
        .slick-dots li.slick-active div {
          background-color: #6366f1 !important; /* indigo-500 */
          transform: scale(1.2);
        }
        .slick-track {
          display: flex !important;
          gap: 0; 
        }
        .slick-slide {
          height: auto;
          padding: 0 12px; 
        }
        .slick-slide > div {
          height: 100%;
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
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-white">5.0</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full" />
            <span>5 Avaliações no</span>
            <span className="font-bold">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </span>
          </div>
          
          <a href="#" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-2">
            Ver todas as avaliações no Google <ArrowRight className="w-3 h-3 ml-1" />
          </a>
        </div>

        {/* Reviews Carousel */}
        <div className="mb-24 px-4 md:px-8">
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={index} className="h-full pt-2 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col h-full relative group min-h-[320px]"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800 group-hover:text-indigo-500/20 transition-colors" />
                  
                  <div className="flex text-yellow-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-300 mb-8 flex-grow leading-relaxed line-clamp-6">
                    "{review.text}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all">
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
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
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Iniciar Meu Projeto <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Falar com Especialista
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
