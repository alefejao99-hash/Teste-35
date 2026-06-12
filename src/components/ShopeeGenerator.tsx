import React, { useState } from 'react';
import { Flame, Sparkles, MessageSquare, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface ShopeeGeneratorProps {
  onAddGeneratedProduct: (product: Omit<Product, 'id' | 'clicks' | 'date'>) => void;
  onOpenManualModal?: () => void;
}

type StyledTone = 'Em Chamas' | 'Super Oferta' | 'Elegante' | 'Urgente';

export default function ShopeeGenerator({ onAddGeneratedProduct, onOpenManualModal }: ShopeeGeneratorProps) {
  const [inputText, setInputText] = useState('');
  const [style, setStyle] = useState<StyledTone>('Super Oferta');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg('Por favor, cole um texto ou link da Shopee antes de gerar!');
      return;
    }

    setIsGenerating(true);
    setStatusMsg('Analisando texto e consultando a IA do Gemini...');
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/gemini/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText,
          style,
        }),
      });

      if (!response.ok) {
        throw new Error('O servidor de geração de anúncios falhou. Tente novamente.');
      }

      const productData = await response.json();

      if (!productData || !productData.title) {
        throw new Error('Nenhum dado válido de produto pôde ser extraído.');
      }

      // Add to main state (this triggers the auto-registration "cadastre automaticamente" rule!)
      onAddGeneratedProduct({
        title: productData.title,
        description: productData.description,
        category: productData.category as Product['category'],
        imageUrl: productData.imageUrl,
        originalPrice: productData.originalPrice,
        discountPrice: productData.discountPrice,
        affiliateUrl: productData.affiliateUrl,
        platforms: 'shopee',
      });

      setInputText('');
      setSuccessMsg(`🎉 Cadastrado com sucesso! "${productData.title}" apareceu no topo do feed.`);
      
      // Auto clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 6000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao conectar ao servidor de inteligência artificial. Tente salvar manualmente.');
    } finally {
      setIsGenerating(false);
      setStatusMsg('');
    }
  };

  const tones: { label: StyledTone; icon: string; bg: string; border: string }[] = [
    { label: 'Em Chamas', icon: '🔥', bg: 'hover:bg-red-500/10', border: 'border-red-550/30' },
    { label: 'Super Oferta', icon: '💥', bg: 'hover:bg-amber-500/10', border: 'border-amber-550/30' },
    { label: 'Elegante', icon: '✨', bg: 'hover:bg-emerald-500/10', border: 'border-emerald-555/30' },
    { label: 'Urgente', icon: '⚡', bg: 'hover:bg-orange-500/10', border: 'border-orange-550/30' },
  ];

  return (
    <div className="space-y-4">
      {/* Huge orange Adicionar Produto button that matches user screenshot */}
      <button
        onClick={onOpenManualModal}
        className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-black text-xs sm:text-sm py-4.5 rounded-2xl shadow-xl shadow-amber-550/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-extrabold uppercase tracking-widest border border-amber-400/20"
      >
        <span>📦 CADASTRAR NOVO ACHADO</span>
      </button>

      {/* Styled Shopee Pro AI Generator panel directly on screen as in image */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl relative">
        {/* Fire gradient top border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
        
        {/* Card Header with Fire symbol */}
        <div className="p-4 sm:p-5 border-b border-zinc-900 bg-zinc-950/40 flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
            <Flame className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Gerador Shopee Pro
              <span className="bg-red-550 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">AI Powered</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Cole a descrição ou link e gere um anúncio profissional com cadastro automático
            </p>
          </div>
        </div>

        {/* Card Form */}
        <form onSubmit={handleGenerate} className="p-4 sm:p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs rounded-xl flex items-start gap-2 animate-bounce">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Shopee paste box */}
          <div className="space-y-2">
            <label className="block text-xxs font-bold text-emerald-500 uppercase tracking-widest font-mono">
              📋 TEXTO COPIADO DA SHOPEE
            </label>
            <textarea
              required
              rows={4}
              placeholder="Cole aqui a mensagem copiada da Shopee...&#10;&#10;Exemplo: Olhe esse relogio premium militar R$ 49.90 link: https://shope.ee/..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-zinc-950 border border-emerald-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3.5 text-xs text-zinc-250 placeholder-zinc-600 focus:outline-none transition-all font-mono leading-relaxed"
            />
          </div>

          {/* Ad format style selectors */}
          <div className="space-y-2.5">
            <label className="block text-xxs font-bold text-amber-500 uppercase tracking-widest font-mono">
              🎨 ESTILO DO ANÚNCIO
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              {tones.map((t) => {
                const isActive = style === t.label;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setStyle(t.label)}
                    disabled={isGenerating}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 font-extrabold shadow-md'
                        : `bg-zinc-900/60 text-zinc-400 ${t.border} ${t.bg} hover:text-zinc-200`
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit actions */}
          <div className="pt-2">
            {isGenerating ? (
              <div className="w-full flex flex-col items-center justify-center p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                <span className="text-xs font-mono text-amber-550 animate-pulse">{statusMsg}</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-display font-black text-xs sm:text-sm rounded-xl cursor-pointer hover:shadow-lg hover:shadow-orange-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest font-extrabold"
              >
                <span>🚀 GERAR ANÚNCIO</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
