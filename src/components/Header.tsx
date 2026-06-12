import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Flame, Bell, Settings, PlusCircle, CheckCircle, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenAdmin: () => void;
  productsCount: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onOpenAdmin, 
  productsCount,
  currentUser,
  onOpenAuth,
  onLogout
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [tickerIndex, setTickerIndex] = useState(0);

  const announcements = [
    '🔥 CUPONS DE ATÉ 70% OFF NA SHOPEE HOJE!',
    '⚡ ATUALIZADO 24H POR DIA COM NOVOS ACHADOS',
    '💬 ENTRE NO GRUPO DE WHATSAPP PARA RECEBER LINKS',
    '🎯 OFERTAS DE CONFIANÇA VERIFICADAS E SEGURAS'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(tickerTimer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      {/* Dynamic Announcement Ticker */}
      <div className="bg-amber-500 text-zinc-950 py-1.5 px-4 text-center font-display text-xs font-bold tracking-wider relative overflow-hidden flex items-center justify-center gap-2">
        <Flame className="w-3.5 h-3.5 animate-pulse text-zinc-950 fill-zinc-950" />
        <span className="transition-all duration-500 ease-in-out">
          {announcements[tickerIndex]}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-3.5 flex flex-col gap-3">
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl shadow-lg border border-amber-400/20">
              <ShoppingCart className="w-5.5 h-5.5 text-zinc-950" />
            </div>
            <div>
              <h1 id="brand-title" className="font-display text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                BassCompreMais<span className="text-amber-500">Achadinho</span>
              </h1>
              <p className="text-[10px] text-zinc-400 tracking-wider uppercase mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Ativas: {productsCount} {timeStr && `• ${timeStr}`}</span>
              </p>
            </div>
          </div>

          {/* Action buttons with User feedback */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* User details capsule */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                  <UserIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span className="text-zinc-250 font-medium max-w-[80px] sm:max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {currentUser.isAdmin && (
                    <span className="bg-amber-500 text-zinc-950 font-black text-[8px] px-1 py-0.5 rounded uppercase tracking-wider scale-95 origin-right">
                      👑 Dono
                    </span>
                  )}
                </div>

                {/* Create Offer option - only enabled for site owners */}
                {currentUser.isAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
                    title="Cadastrar Novo Achado"
                  >
                    <PlusCircle className="w-4 h-4 text-zinc-950" />
                    <span className="hidden sm:inline">Nova Oferta</span>
                  </button>
                )}

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Unauthorized Guest trigger */
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-350 hover:text-white rounded-lg transition-all cursor-pointer font-semibold"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Entrar (Digital / Senha)</span>
              </button>
            )}
          </div>
        </div>

        {/* Improved Interactive Search Container */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar ofertas imperdíveis (Tênis, Casa, Moda, WhatsApp...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-xl placeholder-zinc-500 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-400 hover:text-zinc-200"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

