import React, { useState } from 'react';
import { X, Save, Sparkles, Image, Check, AlertCircle, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const STOCK_IMAGE_PRESETS = [
  { label: '👗 Moda / Roupas', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
  { label: '👟 Tênis / Esportes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
  { label: '🧼 Casa / Higiene', url: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=600' },
  { label: '🧸 Bebê / Brinquedos', url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600' },
  { label: '🏠 Casas / Aluguel', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
  { label: '📱 Eletrônicos / Tech', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600' },
];

export default function EditProductForm({ product, onClose, onUpdateProduct, onDeleteProduct }: EditProductFormProps) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description || '');
  const [category, setCategory] = useState<Product['category']>(product.category);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice?.toString() || '');
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice?.toString() || '');
  const [affiliateUrl, setAffiliateUrl] = useState(product.affiliateUrl || '');
  const [platforms, setPlatforms] = useState<Product['platforms']>(product.platforms || 'shopee');
  const [whatsAppButtonText, setWhatsAppButtonText] = useState(product.whatsAppButtonText || '');

  const [activePresetIndex, setActivePresetIndex] = useState(() => {
    return STOCK_IMAGE_PRESETS.findIndex(item => item.url === product.imageUrl);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !affiliateUrl.trim()) {
      alert('Favor preencher o Título, Descrição e Link de Afiliado!');
      return;
    }

    onUpdateProduct({
      ...product,
      title,
      description,
      category,
      imageUrl,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      affiliateUrl,
      platforms,
      whatsAppButtonText: whatsAppButtonText || undefined,
    });
    onClose();
  };

  const selectPreset = (url: string, index: number) => {
    setImageUrl(url);
    setActivePresetIndex(index);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Tem certeza que deseja excluir o achado "${title}" definitivamente?`)) {
      onDeleteProduct(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col w-full">
        {/* Border warning header banner */}
        <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 border-b border-zinc-800 bg-zinc-950/30 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-500">✏️</span>
              Editar Informações do Achado
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Modifique os dados do produto. As alterações serão refletidas em tempo real para os visitantes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg border border-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excluir</span>
          </button>
        </div>

        {/* Form Elements with Internal Scroll */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {/* Title input field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Título do Card (Com Emojis!)</label>
            <input
              type="text"
              required
              placeholder="Ex: 🛒 Baby Doll Canelado com Renda Conforto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Description details */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Descrição detalhada</label>
            <textarea
              required
              rows={3}
              placeholder="Descreva as especificações do produto e vantagens oferecidas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-350 focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-200"
              >
                <option value="moda">👗 Moda & Confecção</option>
                <option value="casa">🏠 Casa & Higiene</option>
                <option value="bebe-brinquedos">🧸 Brinquedos & Infantil</option>
                <option value="calcados">👟 Calçados & Esporte</option>
                <option value="packs-videos">🔥 Packs de Vídeos</option>
                <option value="aluguel">🏡 Aluguel de Imóveis</option>
                <option value="outros">📍 Outros Achados</option>
              </select>
            </div>

            {/* Platforms origin */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Plataforma Origem</label>
              <select
                value={platforms}
                onChange={(e) => setPlatforms(e.target.value as Product['platforms'])}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-350 focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-200"
              >
                <option value="shopee">Shopee</option>
                <option value="amazon">Amazon</option>
                <option value="whatsapp">Grupo WhatsApp</option>
                <option value="outros">Outro Canal / Site</option>
              </select>
            </div>
          </div>

          {/* Pricing parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Preço Original (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 59.90 (Em branco para gratuito)"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Preço Promocional (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 29.90 (Em branco para gratuito)"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Affiliate direct link */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">Link de Afiliado ou Canal</label>
            <input
              type="url"
              required
              placeholder="Ex: https://shope.ee/..."
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Custom WhatsApp message overriding */}
          {platforms === 'whatsapp' && (
            <div className="space-y-1.5 animate-slide-up">
              <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wide">Texto Customizado do Botão (WhatsApp)</label>
              <input
                type="text"
                placeholder="Ex: ENTRAR NO GRUPO DE OFERTAS"
                value={whatsAppButtonText}
                onChange={(e) => setWhatsAppButtonText(e.target.value)}
                className="w-full bg-zinc-950 border border-emerald-950/40 rounded-xl px-3.5 py-2.5 text-xs text-zinc-250 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Preset templates choice */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-amber-500" />
              Banners Fotográficos de Produto (Clique para aplicar)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STOCK_IMAGE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectPreset(preset.url, idx)}
                  className={`p-2 rounded-xl border text-left flex flex-col gap-1 items-stretch transition-all relative overflow-hidden h-20 ${
                    activePresetIndex === idx
                      ? 'border-amber-500 bg-amber-500/10 text-cyan-50'
                      : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="absolute inset-0 w-full h-full object-cover opacity-10"
                  />
                  <span className="text-[9px] font-bold leading-tight z-10">{preset.label}</span>
                  {activePresetIndex === idx && (
                    <span className="absolute bottom-1 right-1 p-0.5 bg-amber-500 text-zinc-950 rounded-full z-10">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Direct Image Overriding Input */}
            <div className="pt-2 space-y-1">
              <span className="text-[10px] text-zinc-500 block">Ou digite uma URL de imagem customizada de sua preferência:</span>
              <input
                type="url"
                placeholder="Ex: https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setActivePresetIndex(-1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 text-ellipsis"
              />
            </div>
          </div>
        </form>

        {/* Action Panel Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-3.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>GRAVAR ALTERAÇÕES</span>
          </button>
        </div>
      </div>
    </div>
  );
}
