import React from 'react';
import { Flame, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

interface FooterAdProps {
  customLink?: string;
}

export default function FooterAd({ customLink }: FooterAdProps) {
  // Shopee-specific affiliate link for lightning deals
  const adLink = customLink || 'https://shope.ee/6KghvU4Kpx';

  const handleAdClick = () => {
    window.open(adLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleAdClick}
      className="group relative overflow-hidden rounded-2xl bg-zinc-950 border border-orange-500/30 hover:border-orange-500/60 p-4 sm:p-5 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex flex-col sm:flex-row items-center gap-4 hover:shadow-orange-500/5 animate-pulse-subtle border-r-4 border-r-[#EE4D2D]"
    >
      {/* Background radial highlight in Shopee Orange */}
      <div className="absolute bottom-0 right-0 w-44 h-44 bg-gradient-to-t from-[#EE4D2D]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Ticket ticket lines */}
      <div className="absolute top-1/2 -left-2 w-4 h-8 bg-zinc-950 rounded-full border border-orange-500/30 transform -translate-y-1/2 z-10 hidden sm:block" />

      {/* Ad Badge */}
      <div className="absolute top-2.5 right-3 px-1.5 py-0.5 bg-[#EE4D2D]/10 border border-[#EE4D2D]/20 text-[8px] font-black font-mono text-[#EE4D2D] rounded uppercase tracking-wider">
        Super Oferta
      </div>

      {/* Product / Promo Image Visual */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=200" 
          alt="Achados Imperdíveis" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-2xl animate-bounce">⚡</span>
        </div>
      </div>

      {/* Text Info */}
      <div className="flex-1 space-y-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest text-[#EE4D2D] bg-[#EE4D2D]/10 rounded border border-[#EE4D2D]/20 uppercase font-mono flex items-center gap-0.5 animate-pulse">
            <Flame className="w-2.5 h-2.5 fill-[#EE4D2D] text-[#EE4D2D]" /> OFERTAS RELÂMPAGO
          </span>
          <span className="text-[10px] text-zinc-400 font-mono font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3 text-orange-500" /> Até 80% de Desconto Direto
          </span>
        </div>

        <h4 className="font-display text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-orange-400 transition-colors">
          ⚡ SELEÇÃO SECRETA: ACHADINHOS SHOPEE MAIS VENDIDOS!
        </h4>
        <p className="text-zinc-400 text-xxs sm:text-xs max-w-lg leading-relaxed select-none">
          Coletamos os maiores descontos reais em utilidades domésticas, moda e eletrônicos com frete gratuito e avaliações 5 estrelas. Venha economizar agora!
        </p>
      </div>

      {/* Call to Action Button */}
      <div className="flex-shrink-0 w-full sm:w-auto">
        <button className="w-full bg-[#EE4D2D] hover:bg-[#D73C1C] text-white font-display font-black text-xxs sm:text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/15 cursor-pointer">
          <span>APROVEITAR AGORA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
