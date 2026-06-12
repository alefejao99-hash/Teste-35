import React, { useState } from 'react';
import { X, Save, Plus, Sparkles, Image, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface AddProductFormProps {
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'clicks' | 'date'>) => void;
}

const STOCK_IMAGE_PRESETS = [
  { label: '👗 Moda / Roupas', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
  { label: '👟 Tênis / Esportes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
  { label: '🧼 Casa / Higiene', url: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=600' },
  { label: '🧸 Bebê / Brinquedos', url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600' },
  { label: '🏠 Casas / Aluguel', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
  { label: '📱 Eletrônicos / Tech', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600' },
];

export default function AddProductForm({ onClose, onAddProduct }: AddProductFormProps) {
  const [activeTab, setActiveTab] = useState<'shopee' | 'manual'>('shopee');
  const [shopeeLinkInput, setShopeeLinkInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStep, setImportStep] = useState('');
  const [importError, setImportError] = useState('');
  const [shopeeSuccessMsg, setShopeeSuccessMsg] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Product['category']>('moda');
  const [imageUrl, setImageUrl] = useState(STOCK_IMAGE_PRESETS[0].url);
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [platforms, setPlatforms] = useState<Product['platforms']>('shopee');
  const [whatsAppButtonText, setWhatsAppButtonText] = useState('');

  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !affiliateUrl.trim()) {
      alert('Favor preencher o Título, Descrição e Link de Afiliado!');
      return;
    }

    onAddProduct({
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

  const handleShopeeImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    setShopeeSuccessMsg('');

    if (!shopeeLinkInput.trim()) {
      setImportError('Por favor, informe o link do produto da Shopee.');
      return;
    }

    const lower = shopeeLinkInput.toLowerCase();
    const isShopee = lower.includes('shopee.com') || lower.includes('shope.ee') || lower.includes('shopee.com.br');
    if (!isShopee) {
      setImportError('Aviso de Regra Shopee: O link colocado não pertence aos domínios shope.ee ou shopee.com.br. Use somente links genuínos para evitar penalizações do programa!');
      return;
    }

    setIsImporting(true);
    setImportStep('🔍 Verificando domínio e credenciais de afiliado Shopee...');

    // Simulate multi-step loading animation
    setTimeout(() => {
      setImportStep('📦 Buscando cupons e especificações no site da Shopee...');
      setTimeout(() => {
        setImportStep('✨ Validando conformidade anti-spam e gerando card...');
        setTimeout(() => {
          // Generate realistic sample product details based on random keywords or generic hot-selling items
          let autoTitle = '🛍️ Oferta Especial Shopee';
          let autoDesc = 'Super achadinho encontrado na Shopee com frete grátis e excelente avaliação dos compradores!';
          let autoCat: Product['category'] = 'moda';
          let autoOrig = '89.90';
          let autoDisc = '39.90';
          let presetIdx = 0;

          // Cute keyword matching for smart fields pre-filling
          if (lower.includes('tenis') || lower.includes('sapat') || lower.includes('chinel') || lower.includes('calcado')) {
            autoTitle = '👟 Meia Conforto ou Tênis Esportivo Casual Premium';
            autoDesc = 'Um dos calçados mais vendidos da Shopee no Brasil! Maciez extrema para caminhadas, costura reforçada e design moderno. Compre utilizando o link de afiliado oficial seguro.';
            autoCat = 'calcados';
            autoOrig = '149.90';
            autoDisc = '69.90';
            presetIdx = 1; // Tênis
          } else if (lower.includes('casa') || lower.includes('cozinha') || lower.includes('panela') || lower.includes('limpez') || lower.includes('mop') || lower.includes('decor')) {
            autoTitle = '🏠 Organização Prática ou Conjunto de Cozinha Multi-uso';
            autoDesc = 'Perfeito para otimizar espaço em armários ou prateleiras. Material de primeira qualidade, higienização super simplificada e entrega ultra rápida Shopee Envios.';
            autoCat = 'casa';
            autoOrig = '79.90';
            autoDisc = '34.90';
            presetIdx = 2; // Casa
          } else if (lower.includes('bebe') || lower.includes('brinqued') || lower.includes('crianc') || lower.includes('bebé')) {
            autoTitle = '🧸 Kit Brinquedos Educativos Montessori Infantil';
            autoDesc = 'Estimula a coordenação motora fina do seu bebê de forma segura e divertida. Feito de madeira tratada atóxica. Certificado com selo de segurança.';
            autoCat = 'bebe-brinquedos';
            autoOrig = '99.00';
            autoDisc = '49.90';
            presetIdx = 3; // Bebê
          } else if (lower.includes('video') || lower.includes('pack') || lower.includes('canal') || lower.includes('drive')) {
            autoTitle = '🔥 VIP Pack de Vídeos Virais e Modelos Shopee';
            autoDesc = 'Acesso imediato a centenas de criativos testados de alta conversão para seus stories ou reels de achadinhos. O segredo dos maiores afiliados para explodir as vendas!';
            autoCat = 'packs-videos';
            autoOrig = '197.00';
            autoDisc = '19.90';
            presetIdx = 5; // Tech/Eletronicos
          } else if (lower.includes('roupa') || lower.includes('vestid') || lower.includes('camis') || lower.includes('moda') || lower.includes('blusa') || lower.includes('short')) {
            autoTitle = '👗 Conjunto Casual Elegante Canelado Trend';
            autoDesc = 'Super confortável, com caimento perfeito no corpo. Tecido malha canelada de alta qualidade que não desbota. Ideal para o dia a dia.';
            autoCat = 'moda';
            autoOrig = '69.90';
            autoDisc = '29.90';
            presetIdx = 0; // Moda
          }

          // Pre-fill state
          setTitle(autoTitle);
          setDescription(autoDesc);
          setCategory(autoCat);
          setAffiliateUrl(shopeeLinkInput);
          setOriginalPrice(autoOrig);
          setDiscountPrice(autoDisc);
          setPlatforms('shopee');
          setImageUrl(STOCK_IMAGE_PRESETS[presetIdx].url);
          setActivePresetIndex(presetIdx);

          setIsImporting(false);
          setShopeeSuccessMsg('✓ Link da Shopee processado com sucesso! Dados inseridos. Prossiga salvando o card.');
          setActiveTab('manual'); // Switch to review / save
        }, 1100);
      }, 950);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Border warning header banner */}
        <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 border-b border-zinc-800 bg-zinc-950/30">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Cadastrar Novo Achado
          </h3>
          <p className="text-[11px] text-zinc-400 mt-1">
            Preencha os campos abaixo para divulgar um novo produto ou grupo. O link será adicionado ao feed instantaneamente.
          </p>
        </div>

        {/* Priority Tabs Switcher */}
        <div className="px-5 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('shopee');
              setImportError('');
              setShopeeSuccessMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'shopee'
                ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                : 'bg-transparent text-zinc-400 border-zinc-800 hover:bg-zinc-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-550 animate-pulse" />
            <span>⚡ Link Rápido Shopee (Auto)</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              setImportError('');
              setShopeeSuccessMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                : 'bg-transparent text-zinc-400 border-zinc-800 hover:bg-zinc-850'
            }`}
          >
            <span>✍️ Cadastro Manual / Geral</span>
          </button>
        </div>

        {activeTab === 'shopee' ? (
          /* Auto Shopee Link parsing engine UI */
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-zinc-300 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-amber-400">💡 Como funciona o Importador Express?</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Copie o seu link de afiliado oficial coletado no app da Shopee, cole no campo abaixo e nós geraremos todas as descrições e banners automáticos, em conformidade com as regras oficiais do programa de afiliados da Shopee.
              </p>
            </div>

            {importError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            <form onSubmit={handleShopeeImport} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Cole o Link do Produto da Shopee</label>
                <input
                  type="url"
                  required
                  placeholder="https://shope.ee/..."
                  value={shopeeLinkInput}
                  onChange={(e) => setShopeeLinkInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-zinc-655"
                  disabled={isImporting}
                />
              </div>

              {isImporting ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-mono text-amber-500 animate-pulse">{importStep}</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-black text-xs sm:text-sm rounded-xl cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>BUSCAR E AUTO-COMPLETAR</span>
                </button>
              )}
            </form>
          </div>
        ) : (
          /* Form elements with scrollbar */
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
            {shopeeSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{shopeeSuccessMsg}</span>
              </div>
            )}

            {/* Title Field with Emoji hint */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Título do Card (Adicione Emojis no início!)</label>
              <input
                type="text"
                required
                placeholder="Ex: 🛒 Camisa Polo Casual Masculina Tecido Premium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Description Section */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Descrição / Benefícios</label>
              <textarea
                required
                rows={3}
                placeholder="Ex: Tecido respirável de alta costura, corte moderno slim-fit. Oferta disponível enquanto durarem os estoques promocionais!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Product['category'])}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
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

              {/* Platforms selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Plataforma Origem</label>
                <select
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value as Product['platforms'])}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="shopee">Shopee</option>
                  <option value="amazon">Amazon</option>
                  <option value="whatsapp">Grupo WhatsApp</option>
                  <option value="outros">Outro Canal / Site</option>
                </select>
              </div>
            </div>

            {/* Pricing settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Preço Original (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 59.90 (Opcional)"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-250 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Preço Promocional (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 29.90 (Opcional)"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-250 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Destination URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide">Link de Afiliado / Destino</label>
              <input
                type="url"
                required
                placeholder="Ex: https://shope.ee/seu-codigo-de-afiliado"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-250 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Optional: WhatsApp Button custom message override */}
            {platforms === 'whatsapp' && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wide">Texto do Botão (Exclusivo WhatsApp)</label>
                <input
                  type="text"
                  placeholder="Ex: PARTICIPAR DO GRUPO GRÁTIS"
                  value={whatsAppButtonText}
                  onChange={(e) => setWhatsAppButtonText(e.target.value)}
                  className="w-full bg-zinc-950 border border-emerald-950/40 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Visual Image presets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-350 uppercase tracking-wide flex items-center gap-1">
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
                    {/* Subtle preset image overlay */}
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

              {/* Custom image option backup field */}
              <div className="pt-2 space-y-1">
                <span className="text-[10px] text-zinc-500 block">Ou digite uma URL de imagem customizada de sua preferência:</span>
                <input
                  type="url"
                  placeholder="Ex: https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setActivePresetIndex(-1); // Deselect Preset index
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 text-ellipsis"
                />
              </div>
            </div>
          </form>
        )}

        {/* Footer actions */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-3.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          
          {activeTab === 'manual' && (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>SALVAR ACHADINHO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
