import React from 'react';
import { Send, Sparkles, MessageCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface PromoBannerProps {
  onJoinWhatsApp: () => void;
  title?: string;
  subTitle?: string;
}

export default function PromoBanner({ onJoinWhatsApp, title, subTitle }: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 mb-6">
      {/* Absolute Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Repeating Safety Stripe Top Border */}
      <div className="absolute top-0 inset-x-0 h-1.5 safety-stripe" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-500 bg-amber-500/10 rounded-full border border-amber-500/20 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
              Recomendado
            </span>
            <span className="text-xs text-zinc-400 font-mono">• Grupo Oficial</span>
          </div>

          <h3 className="font-display text-lg sm:text-xxl font-bold text-white tracking-tight">
            {title || '⚡ OFERTA WHATSAPP - GRUPO OFICIAL ⚡'}
          </h3>
          
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            {subTitle || 'Quer economizar de verdade nas suas compras? Postamos produtos com cupons de descontos reais, promoções e achados todos os dias. Entre no nosso grupo e não perca nada!'}
          </p>

          <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1">
            <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Links 100% Verificados e Seguros
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              👥 +12.4K membros economizando
            </span>
          </div>
        </div>

        <button
          onClick={onJoinWhatsApp}
          className="flex-shrink-0 group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-zinc-950 font-display font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 border border-emerald-400/20 active:scale-95 cursor-pointer"
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
          
          <MessageCircle className="w-4.5 h-4.5 fill-zinc-950 text-zinc-950" />
          <span>ENTRAR NO GRUPO DO WHATSAPP</span>
          <ArrowRight className="w-4 h-4 text-zinc-950 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: skewX(-12deg) translateX(100%);
          }
        }
        .group-hover\\:animate-shimmer {
          animation: shimmer 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
