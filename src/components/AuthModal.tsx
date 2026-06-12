import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, Fingerprint, Sparkles, Check, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Digital-Login simulation state
  const [showFingerprint, setShowFingerprint] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Default Admin Emails list
  const ADMIN_EMAILS = ['m4gn4t4m0dz@outlook.com', 'admin@bass.com', 'dono@bass.com'];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    const savedUsersStr = localStorage.getItem('bass_compre_mais_users') || '[]';
    let usersList: any[] = [];
    try {
      usersList = JSON.parse(savedUsersStr);
    } catch (e) {
      usersList = [];
    }

    if (isRegister) {
      if (!name) {
        setErrorMsg('Por favor, preencha o seu nome.');
        return;
      }

      const userExists = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setErrorMsg('Estes dados de e-mail já estão cadastrados.');
        return;
      }

      // Check if this input matches admin email or password is the master key
      const isUserAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || password === '606499';

      const newUser = {
        name,
        email: email.toLowerCase(),
        password,
        isAdmin: isUserAdmin
      };

      usersList.push(newUser);
      localStorage.setItem('bass_compre_mais_users', JSON.stringify(usersList));

      setSuccessMsg('Cadastro realizado com sucesso!');
      setTimeout(() => {
        const loggedInUser: User = {
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin
        };
        onLoginSuccess(loggedInUser);
        onClose();
      }, 1500);

    } else {
      // Login flow
      const user = usersList.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      // Default quick access test-account if db is completely empty
      let testUser = null;
      if (!user && (email.toLowerCase() === 'admin@bass.com' || email.toLowerCase() === 'm4gn4t4m0dz@outlook.com') && password === '606499') {
        testUser = {
          name: 'Dono Bass',
          email: email.toLowerCase(),
          isAdmin: true
        };
      }

      if (user) {
        // If password is the admin password, automatically promote to admin
        const isAdminUser = user.isAdmin || password === '606499' || ADMIN_EMAILS.includes(email.toLowerCase());
        const loggedInUser: User = {
          name: user.name,
          email: user.email,
          isAdmin: isAdminUser
        };
        setSuccessMsg('Acesso autorizado! Bem-vindo(a).');
        setTimeout(() => {
          onLoginSuccess(loggedInUser);
          onClose();
        }, 1200);
      } else if (testUser) {
        setSuccessMsg('Acesso padrão de teste autorizado! Bem-vindo(a), Administrador.');
        setTimeout(() => {
          onLoginSuccess(testUser!);
          onClose();
        }, 1250);
      } else {
        setErrorMsg('E-mail ou senha incorretos! Para testar como Dono use admin@bass.com e senha 606499');
      }
    }
  };

  // Digital Print Bio Lock Scan triggers
  const startScanning = () => {
    if (scanComplete) return;
    setScanning(true);
    setScanProgress(0);
    setErrorMsg('');

    let progress = 0;
    scanTimerRef.current = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress >= 100) {
        if (scanTimerRef.current) clearInterval(scanTimerRef.current);
        setScanning(false);
        setScanComplete(true);
        
        // Simulates finding the master admin account or logging in as guest admin
        const loggedInUser: User = {
          name: 'Dono do Site (Biometria)',
          email: 'm4gn4t4m0dz@outlook.com',
          isAdmin: true
        };

        setSuccessMsg('⚡ Biometria Digital Reconhecida com Sucesso! Modo Dono Ativado.');
        setTimeout(() => {
          onLoginSuccess(loggedInUser);
          onClose();
        }, 1500);
      }
    }, 150);
  };

  const cancelScanning = () => {
    if (scanComplete) return;
    setScanning(false);
    setScanProgress(0);
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Safety Stripe visual line */}
        <div className="absolute top-0 inset-x-0 h-1.5 safety-stripe" />

        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors z-10 border border-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pb-4 border-b border-zinc-850">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
            {showFingerprint ? 'Autenticação por Digital (BioLock)' : (isRegister ? 'Criar Nova Conta' : 'Login de Entrada')}
          </h3>
          <p className="text-[11px] text-zinc-400 mt-1">
            {showFingerprint 
              ? 'Mantenha o dedo pressionado no leitor abaixo para liberar o perfil administrador imediatamente.'
              : 'Faça login para cadastrar novos achados e gerenciar as ofertas ativas no site.'
            }
          </p>
        </div>

        {/* Toggle Mode button */}
        {!showFingerprint && (
          <div className="px-6 pt-4 flex gap-2">
            <button
              onClick={() => {
                setIsRegister(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                !isRegister ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-transparent text-zinc-400 border-zinc-800 hover:bg-zinc-850'
              }`}
            >
              Fazer Login
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isRegister ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-transparent text-zinc-400 border-zinc-800 hover:bg-zinc-850'
              }`}
            >
              Registrar Conta
            </button>
          </div>
        )}

        {/* Content Box */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {showFingerprint ? (
            /* Fingerprint Bio Scan simulated */
            <div className="py-6 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                {/* Wave Laser Pulse scanner effect */}
                {scanning && (
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-ping" />
                )}
                
                <button
                  onMouseDown={startScanning}
                  onMouseUp={cancelScanning}
                  onMouseLeave={cancelScanning}
                  onTouchStart={startScanning}
                  onTouchEnd={cancelScanning}
                  className={`relative p-8 rounded-full border-2 cursor-pointer select-none transition-all duration-300 transform active:scale-95 ${
                    scanComplete 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : (scanning ? 'bg-amber-500/10 border-amber-500 text-amber-500 scale-105' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200')
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  <Fingerprint className={`w-16 h-16 ${scanning ? 'animate-pulse' : ''}`} />

                  {/* Ring laser visual scanning pointer */}
                  {scanning && (
                    <div 
                      className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-bounce"
                      style={{ top: `${scanProgress}%` }}
                    />
                  )}
                </button>
              </div>

              {/* Scan status indicator */}
              <div className="text-center space-y-1">
                <p className="text-xs font-mono font-bold text-zinc-350">
                  {scanComplete 
                    ? '✓ AUTENTICADO' 
                    : (scanning ? `ESCANEANDO DIGITAL... ${scanProgress}%` : 'CLIQUE E SEGURE O SENSOR')
                  }
                </p>
                <p className="text-[10px] text-zinc-550 max-w-xs leading-normal">
                  Este simulador biométrico utiliza verificação exclusiva pelo navegador para validação instantânea do Dono.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowFingerprint(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-amber-500 hover:underline font-semibold"
              >
                Voltar para Login por Senha
              </button>
            </div>
          ) : (
            /* Traditional Password Form */
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
                    <input
                      type="text"
                      required
                      placeholder="Seu nome ou apelido"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Endereço de E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
                  <input
                    type="email"
                    required
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                {email && ADMIN_EMAILS.includes(email.toLowerCase()) && (
                  <span className="text-[9px] text-amber-400 font-bold tracking-wider block font-mono">
                    👑 ESTE E-MAIL PERTENCE AO DONO DO SITE (MODO ADMIN)
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Sua Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                {!isRegister && (
                  <div className="flex flex-col gap-2 pt-1.5 mt-1 border-t border-zinc-950/45">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">
                        Dica de Dono: <span className="font-mono text-amber-400 font-bold font-semibold">admin@bass.com</span> e senha <span className="font-mono text-amber-400 font-bold font-semibold">606499</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const testUser: User = {
                          name: 'Dono do Projeto (M4GN4T4M0DZ)',
                          email: 'm4gn4t4m0dz@outlook.com',
                          isAdmin: true
                        };
                        setSuccessMsg('Acesso instantâneo de Dono autorizado!');
                        setTimeout(() => {
                          onLoginSuccess(testUser);
                          onClose();
                        }, 1000);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-550/20 to-amber-500/20 hover:from-amber-500 hover:to-amber-600 border border-amber-500/35 hover:border-amber-500/10 text-amber-400 hover:text-zinc-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse hover:text-zinc-950" />
                      <span>Entrar Automatizado como Dono</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-black text-xs sm:text-sm rounded-xl cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 transition-all active:scale-[0.98]"
                >
                  {isRegister ? 'CONCLUIR CADASTRO' : 'ENTRAR NO SITE'}
                </button>

                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowFingerprint(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-display font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Fingerprint className="w-4 h-4 text-amber-500" />
                    <span>Entrar por Impressão Digital</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
