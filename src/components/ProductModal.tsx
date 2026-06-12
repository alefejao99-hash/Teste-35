import React, { useState } from 'react';
import { X, Calendar, Flame, CornerDownRight, Check, ShoppingCart, MessageCircle, AlertTriangle, ShieldCheck, Share2, Clipboard, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onIncrementClicks: (productId: string) => void;
}

export default function ProductModal({ product, onClose, onIncrementClicks }: ProductModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#offer-${product.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const calculateDiscount = () => {
    if (!product.originalPrice || !product.discountPrice) return null;
    const diff = product.originalPrice - product.discountPrice;
    const pct = Math.round((diff / product.originalPrice) * 100);
    return {
      pct,
      saved: diff.toFixed(2).replace('.', ',')
    };
  };

  const discountVal = calculateDiscount();

  const handleRedirect = () => {
    onIncrementClicks(product.id);
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="absolute top-0 inset-x-0 h-1 safety-stripe" />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-zinc-950/80 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-full border border-zinc-805 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Main Visual Image Banner */}
          <div className="relative aspect-video w-full bg-zinc-850">
            <img
              src={product.imageUrl}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
            
            {/* Corner Platform badge */}
            <span className="absolute bottom-4 left-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-xs font-bold text-amber-500 font-mono tracking-wider uppercase">
              🛒 {product.platforms || 'Oferta'}
            </span>
          </div>

          {/* Core Content */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Title & Metadata */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-500 uppercase font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">
                <Calendar className="w-3 h-3" /> Publicado em {product.date}
              </span>
              <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                {product.title}
              </h3>
            </div>

            {/* Price block if configured */}
            {product.discountPrice ? (
              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">De: <span className="line-through">R$ {product.originalPrice?.toFixed(2).replace('.', ',')}</span></span>
                  {discountVal && (
                    <span className="text-xs font-bold text-emerald-500 font-mono">
                      Economia de R$ {discountVal.saved}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-zinc-400 text-xs font-semibold">Valor com Desconto:</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                  </span>
                  {discountVal && (
                    <span className="text-[10px] bg-red-500/10 text-red-400 font-bold px-1.5 py-0.5 rounded ml-1 border border-red-500/10">
                      -{discountVal.pct}%
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            {/* Product Details Narrative */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold font-display uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-amber-500" /> Detalhes do Achado
              </h5>
              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-1.5 bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl">
                {product.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Safety Badging Details */}
            <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-400">Verificado de Confiança</p>
                <p className="text-[10px] text-zinc-400">Este link de afiliado passa pela nossa auditoria antifraude e é completamente seguro para compra.</p>
              </div>
            </div>

            {/* Click Count Tracker */}
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Desejado por {product.clicks + 14} pessoas
              </span>
              <span>Categoria: {product.category.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Footer sticky buttons */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
          {/* Share Option */}
          <button
            onClick={handleCopyLink}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer font-display ${
              copied
                ? 'bg-amber-500 border-amber-500 text-zinc-950'
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>COPIADO</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>COMPARTILHAR</span>
              </>
            )}
          </button>

          {/* Outbound Link Button */}
          <button
            onClick={handleRedirect}
            className={`flex-1 font-display font-black text-xs sm:text-sm py-3 px-5 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer transform active:scale-95 transition-all ${
              product.platforms === 'whatsapp'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950'
                : 'bg-amber-500 hover:bg-amber-600 text-zinc-950'
            }`}
          >
            {product.platforms === 'whatsapp' ? (
              <>
                <MessageCircle className="w-4 h-4 fill-zinc-950" />
                <span>Ir para o Grupo de Ofertas</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 fill-zinc-950" />
                <span>PEGAR OFERTA COM DESCONTO</span>
              </>
            )}
            <ExternalLink className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
