import React, { useState } from 'react';
import { Share2, Clock, Eye, AlertCircle, ShoppingBag, ExternalLink, Calendar, Star, Check, Edit3, Trash2 } from 'lucide-react';
import { Product, User } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onOpenDetails: (product: Product) => void;
  onIncrementClicks: (productId: string) => void;
  currentUser: User | null;
  onOpenEdit: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  onOpenDetails, 
  onIncrementClicks,
  currentUser,
  onOpenEdit,
  onDeleteProduct
}: ProductCardProps) {
  const [copied, setCopied] = useState(false);

  // Formats discount percentage
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate real sharing helper
    const shareUrl = `${window.location.origin}/#offer-${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIncrementClicks(product.id);
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Assign branding color colors based on platforms
  const getPlatformColors = () => {
    switch (product.platforms) {
      case 'shopee':
        return { bg: 'bg-[#EE4D2D]/10 text-[#EE4D2D]', border: 'border-[#EE4D2D]/20', label: 'Shopee' };
      case 'amazon':
        return { bg: 'bg-[#FF9900]/10 text-[#FF9900]', border: 'border-[#FF9900]/20', label: 'Amazon' };
      case 'whatsapp':
        return { bg: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20', label: 'WhatsApp' };
      default:
        return { bg: 'bg-amber-500/10 text-amber-500', border: 'border-amber-500/20', label: 'Oferta' };
    }
  };

  const platform = getPlatformColors();

  return (
    <article
      id={`offer-${product.id}`}
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col bg-zinc-950 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-xl hover:shadow-amber-500/5 mb-6"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Floating Category / Platform indicators */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${platform.bg} ${platform.border}`}>
            {platform.label}
          </span>
          {discountVal && (
            <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-950 bg-amber-500 rounded-md">
              {discountVal.pct}% OFF
            </span>
          )}
        </div>

        {/* Rating overlay if present */}
        {product.rating && (
          <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-amber-400 flex items-center gap-0.5 border border-zinc-800">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        )}

        {/* Interactive Stats badges */}
        <div className="absolute bottom-3 right-3 bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 border border-zinc-800">
          <Eye className="w-3 h-3 text-zinc-500" />
          <span>{product.clicks + 43} Visualizações</span>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Main heading styled after image description */}
          <h4 className="font-display font-medium text-sm sm:text-base text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h4>

          {/* Sizable elegant description snippet */}
          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Actions Row */}
        <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-col gap-3">
          {/* Pricing indicators */}
          {product.discountPrice ? (
            <div className="flex items-baseline justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 line-through block">
                  De: R$ {product.originalPrice?.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-base font-bold text-white tracking-tight font-mono">
                  Por: R$ <span className="text-lg text-amber-500">{product.discountPrice.toFixed(2).split('.')[0]}</span>,{product.discountPrice.toFixed(2).split('.')[1]}
                </span>
              </div>
              {discountVal && (
                <span className="text-[10px] text-emerald-400 font-mono font-medium">
                  Poupa: R$ {discountVal.saved}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Oferta Gratuita / Divulgamento</span>
              <span className="text-emerald-400 font-mono text-[10px] font-medium tracking-wide">CONFIRMADA</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* Outbound Link Button */}
            <button
              onClick={handleActionClick}
              className={`flex-1 font-display font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                product.platforms === 'whatsapp'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-extrabold'
                  : 'bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300'
              }`}
            >
              {product.platforms === 'whatsapp' ? (
                <>
                  <span>{product.whatsAppButtonText || 'ACESSAR AGORA'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>PEGAR OFERTA</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </>
              )}
            </button>

            {/* Quick Share Button */}
            <button
              onClick={handleShare}
              title="Copiar link do achado"
              className={`flex-shrink-0 p-2.5 rounded-xl border border-zinc-850 hover:bg-zinc-900 transition-all flex items-center justify-center relative ${
                copied ? 'bg-amber-600 border-amber-600 text-zinc-950' : 'bg-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {copied ? (
                <Check className="w-4 h-4 text-zinc-950" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}

              {/* Toast Copy Prompt */}
              {copied && (
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-950 text-amber-400 border border-amber-500/20 px-2 py-1 rounded text-[9px] font-bold font-mono tracking-wider whitespace-nowrap z-30 shadow-xl animate-fade-in">
                  LINK COPIADO!
                </span>
              )}
            </button>
          </div>

          {/* Admin Exclusive Controls Overlay */}
          {currentUser?.isAdmin && (
            <div className="flex gap-2 mt-2 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEdit(product);
                }}
                className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/25 hover:border-amber-500 text-xs font-bold font-display rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Tem certeza que deseja excluir o achado "${product.title}" definitivamente?`)) {
                    onDeleteProduct?.(product.id);
                  }
                }}
                className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-zinc-950 border border-red-500/25 hover:border-red-500 text-xs font-bold font-display rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Excluir Achado definitivamente"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </div>
          )}

          {/* Date Row at bottom matching screenshot */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-950/20">
            <span className="flex items-center gap-1 capitalize">
              <Calendar className="w-3 h-3 opacity-60 text-amber-500" />
              {product.date}
            </span>
            <span className="text-[10px] text-zinc-600 uppercase font-bold">
              #{product.category}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
