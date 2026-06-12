/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Shirt, 
  Home, 
  Baby, 
  Footprints, 
  Video, 
  Key, 
  Grid, 
  Plus, 
  Zap,
  Flame,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  Inbox
} from 'lucide-react';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AddProductForm from './components/AddProductForm';
import EditProductForm from './components/EditProductForm';
import AuthModal from './components/AuthModal';
import { INITIAL_PRODUCTS } from './data';
import { Product, CategoryFilter, User } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // User Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modal states
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Statistics trackers
  const [totalClicksCount, setTotalClicksCount] = useState(0);

  // Load user session & products database
  useEffect(() => {
    // 1. Initial product population
    const cachedProducts = localStorage.getItem('bass_compre_mais_products');
    if (cachedProducts) {
      try {
        const parsed = JSON.parse(cachedProducts) as Product[];
        setProducts(parsed);
      } catch (err) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('bass_compre_mais_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // 2. Load cached logged in user session
    const cachedUser = localStorage.getItem('bass_compre_mais_logged_in_user');
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser) as User;
        setCurrentUser(parsedUser);
      } catch (err) {
        setCurrentUser(null);
      }
    }
  }, []);

  // Sync products list to calculate clicks globally
  useEffect(() => {
    if (products.length > 0) {
      const clicks = products.reduce((sum, item) => sum + (item.clicks || 0), 0);
      setTotalClicksCount(clicks);
    }
  }, [products]);

  // Auth helper controls
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('bass_compre_mais_logged_in_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bass_compre_mais_logged_in_user');
  };

  // Handle addition of a new user-generated "Achadinho"
  const handleAddNewProduct = (newProductData: Omit<Product, 'id' | 'clicks' | 'date'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `custom-offer-${Date.now()}`,
      clicks: 0,
      date: new Date().toLocaleDateString('pt-BR', { month: 'long', day: '2-digit', year: 'numeric' })
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('bass_compre_mais_products', JSON.stringify(updated));
  };

  // Handle updates of an existing "Achadinho"
  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((item) => (item.id === updatedProduct.id ? updatedProduct : item));
    setProducts(updated);
    localStorage.setItem('bass_compre_mais_products', JSON.stringify(updated));
    
    // Auto sync modal preview details if currently watching
    if (activeProductDetail && activeProductDetail.id === updatedProduct.id) {
      setActiveProductDetail(updatedProduct);
    }
  };

  // Handle deletion of an "Achadinho"
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((item) => item.id !== productId);
    setProducts(updated);
    localStorage.setItem('bass_compre_mais_products', JSON.stringify(updated));

    // Deselect if we were actively viewing detail block
    if (activeProductDetail && activeProductDetail.id === productId) {
      setActiveProductDetail(null);
    }
  };

  // Simulates increasing click count for social engagement feedback
  const handleIncrementClicks = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, clicks: p.clicks + 1 };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('bass_compre_mais_products', JSON.stringify(updated));

    // Update active modal view references if currently visible
    if (activeProductDetail && activeProductDetail.id === productId) {
      setActiveProductDetail((prev) => prev ? { ...prev, clicks: prev.clicks + 1 } : null);
    }
  };

  // Filter items matching selected category AND search queries
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesConfig: { value: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'todos', label: 'Todos os Achados', icon: <Grid className="w-3.5 h-3.5" /> },
    { value: 'moda', label: 'Moda', icon: <Shirt className="w-3.5 h-3.5" /> },
    { value: 'casa', label: 'Casa & Higiene', icon: <Home className="w-3.5 h-3.5" /> },
    { value: 'bebe-brinquedos', label: 'Bebê & Brinquedos', icon: <Baby className="w-3.5 h-3.5" /> },
    { value: 'calcados', label: 'Calçados', icon: <Footprints className="w-3.5 h-3.5" /> },
    { value: 'packs-videos', label: 'Packs Shopee', icon: <Video className="w-3.5 h-3.5" /> },
    { value: 'aluguel', label: 'Aluguel Parnaíba', icon: <Key className="w-3.5 h-3.5" /> },
    { value: 'outros', label: 'Outros Grupos', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const handleJoinWhatsAppMain = () => {
    // Lead user automatically to WhatsApp offer group
    window.open('https://chat.whatsapp.com/Lf3yyMFdpxd36JI2V3PJQ3', '_blank', 'noopener,noreferrer');
  };

  // Reset filter helpers
  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col carbon-mesh pb-12">
      {/* Dynamic Header Component */}
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAdmin={() => setIsAdminOpen(true)}
        productsCount={products.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container Wrapper */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        
        {/* Dynamic Highlight Promo Banner */}
        <PromoBanner 
          onJoinWhatsApp={handleJoinWhatsAppMain}
        />

        {/* Categories Carousel Filter Row */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              Navegar por Categoria
            </span>
            <span>Estilo de Visualização: Feed de Cartões</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
            {categoriesConfig.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/10' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Stats Panel Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl flex items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Visualizações Totais</span>
              <span className="text-sm sm:text-base font-bold font-mono text-white">{(totalClicksCount + 10420).toLocaleString('pt-BR')}</span>
            </div>
            <span className="p-2 bg-zinc-900 border border-zinc-800 text-amber-500 rounded-lg text-xs">📈</span>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl flex items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Grupos de Desconto</span>
              <span className="text-sm sm:text-base font-bold font-mono text-white">
                {products.filter(p => p.platforms === 'whatsapp').length} Ativos
              </span>
            </div>
            <span className="p-2 bg-zinc-900 border border-zinc-800 text-emerald-400 rounded-lg text-xs">💬</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl flex items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Desconto Médio</span>
              <span className="text-sm sm:text-base font-bold font-mono text-amber-400">Até 70% OFF</span>
            </div>
            <span className="p-2 bg-zinc-900 border border-zinc-800 text-red-400 rounded-lg text-xs">🔥</span>
          </div>
        </div>

        {/* Admin Control Bar for batch actions */}
        {currentUser?.isAdmin && (
          <div className="bg-zinc-950/80 border border-amber-500/20 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg text-xs">👑</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  Painel de Controle do Dono
                  <span className="bg-amber-500 text-zinc-950 text-[8px] font-black px-1 py-0.5 rounded uppercase font-mono tracking-wider scale-95 origin-left">Modo Admin</span>
                </h4>
                <p className="text-[10px] text-zinc-400 mt-1">Gerenciamento completo do feed e conformidade com as regras de afiliados da Shopee.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja DELETAR todos os achadinhos do feed para começar a cadastrar do zero?')) {
                    setProducts([]);
                    localStorage.setItem('bass_compre_mais_products', JSON.stringify([]));
                  }
                }}
                className="flex-1 md:flex-initial px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-zinc-950 border border-red-500/20 hover:border-red-500 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Deletar permanentemente todas as ofertas do feed"
              >
                Limpar Feed Completo
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Deseja restaurar as ofertas de amostra originais para o feed?')) {
                    setProducts(INITIAL_PRODUCTS);
                    localStorage.setItem('bass_compre_mais_products', JSON.stringify(INITIAL_PRODUCTS));
                  }
                }}
                className="flex-1 md:flex-initial px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Restaurar banco de dados com os produtos padrões"
              >
                Restaurar Amostras
              </button>
            </div>
          </div>
        )}

        {/* Dynamic products list */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-1 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={setActiveProductDetail}
                onIncrementClicks={handleIncrementClicks}
                currentUser={currentUser}
                onOpenEdit={(p) => setEditingProduct(p)}
                onDeleteProduct={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty Search results layout */
          <div className="text-center py-16 bg-zinc-950/40 border border-zinc-900 rounded-2xl space-y-4 max-w-md mx-auto">
            <div className="inline-flex p-4 bg-zinc-900/60 rounded-full border border-zinc-800 text-zinc-650">
              <Inbox className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-zinc-200">Nenhum achadinho encontrado</h4>
              <p className="text-xs text-zinc-400 px-6">
                Não conseguimos achar produtos correspondentes para "{searchQuery}". Experimente outra palavra-chave ou limpe as categorias.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-amber-500 text-zinc-950 text-xs font-bold font-display rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Exibir Todos os Achados
            </button>
          </div>
        )}

      </main>

      {/* Structured Footer */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 pt-6 border-t border-zinc-900 text-center space-y-3.5 w-full">
        <p className="text-xs text-zinc-500 font-mono leading-relaxed">
          © 2026 <span className="text-zinc-400 font-bold">BassCompreMaisAchadinho</span>. Todos os direitos reservados.<br />
          Esta plataforma atua como divulgadora de cupons promocionais e links de afiliados da Shopee e parceiros. 
          Não nos responsabilizamos pela entrega ou variações nos preços dos fornecedores oficiais.
        </p>
        <div className="flex justify-center gap-4 text-[10px] text-zinc-650 font-mono">
          <span>🔒 Criptografia SSL Segura</span>
          <span>•</span>
          <span>🛡️ Segurança Anti-fraude</span>
          <span>•</span>
          <span>✓ Postagens Certificadas</span>
        </div>
      </footer>

      {/* Sliding Product Detail Overlay Modal */}
      {activeProductDetail && (
        <ProductModal
          product={activeProductDetail}
          onClose={() => setActiveProductDetail(null)}
          onIncrementClicks={handleIncrementClicks}
        />
      )}

      {/* Dynamic Product Creation Overlay Modal */}
      {isAdminOpen && (
        <AddProductForm
          onClose={() => setIsAdminOpen(false)}
          onAddProduct={handleAddNewProduct}
        />
      )}

      {/* Dynamic Product Editor Overlay Modal */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Authentication and Registration Overlays */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
