import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { supabase } from './services/supabaseClient';
import type { Bot, ActionLog } from './types';
import { Dashboard } from './components/Dashboard';
import { DeviceList } from './components/DeviceList';
import { ActionPanel } from './components/ActionPanel';
import { PayloadBuilder } from './components/PayloadBuilder';
import { LiveMap } from './components/LiveMap';
import { Login } from './components/Login';

type NavigationTab = 'dashboard' | 'bots' | 'map' | 'builder';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  
  // State from storage
  const [bots, setBots] = useState<Bot[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Monitor screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Session verification
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Initialize and subscribe to state updates when session is active
  useEffect(() => {
    if (!session) {
      setBots([]);
      setLogs([]);
      return;
    }

    // Initialize backend fetches and subscriptions
    StorageService.initialize();

    // Bind state updates
    setBots(StorageService.getBots());
    setLogs(StorageService.getLogs());

    const unsubscribe = StorageService.subscribe(() => {
      setBots(StorageService.getBots());
      setLogs(StorageService.getLogs());
    });

    return () => {
      unsubscribe();
      StorageService.cleanup();
    };
  }, [session]);

  const handleSelectBot = (botId: string) => {
    setSelectedBotId(botId);
    setActiveTab('bots');
  };

  const handleCloseBotPanel = () => {
    setSelectedBotId(null);
  };

  const activeBot = bots.find(b => b.id === selectedBotId);

  // Show a dark stylized loader while inspecting credentials
  if (loadingSession) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        gap: '12px'
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          borderTopColor: 'var(--accent-purple)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '13px', letterSpacing: '0.5px' }}>Conectando à rede de controle...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render operator Login page if no authenticated session is active
  if (!session) {
    return <Login />;
  }

  return (
    <>
      {/* Navigation Navbar header */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 10px rgba(139, 92, 246, 0.1)'
          }}>
            BTMob V4 Web
          </span>
        </div>

        <nav className="nav-links">
          <button 
            className={`btn nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setSelectedBotId(null); }}
            style={{ background: 'transparent', border: 'none' }}
          >
            📊 Dashboard
          </button>
          <button 
            className={`btn nav-item ${activeTab === 'bots' ? 'active' : ''}`}
            onClick={() => setActiveTab('bots')}
            style={{ background: 'transparent', border: 'none' }}
          >
            📱 Dispositivos
          </button>
          <button 
            className={`btn nav-item ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => { setActiveTab('map'); setSelectedBotId(null); }}
            style={{ background: 'transparent', border: 'none' }}
          >
            🗺️ Live Map
          </button>
          <button 
            className={`btn nav-item ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => { setActiveTab('builder'); setSelectedBotId(null); }}
            style={{ background: 'transparent', border: 'none' }}
          >
            🛠️ Compilador
          </button>
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Servidor Conectado</span>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => supabase.auth.signOut()}
            style={{ padding: '4px 10px', minHeight: '30px', fontSize: '12px' }}
          >
            Sair 🚪
          </button>
        </div>
      </header>

      {/* Main content body layout switcher */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            bots={bots} 
            logs={logs} 
            onSelectBot={handleSelectBot}
            onNavigate={(tab) => {
              if (tab === 'builder') setActiveTab('builder');
              if (tab === 'bots') setActiveTab('bots');
            }}
          />
        )}

        {activeTab === 'bots' && (
          <div className="main-layout" style={{ flex: 1 }}>
            {/* Sidebar list (hidden on mobile if a bot is active) */}
            {(!isMobile || !selectedBotId) && (
              <DeviceList 
                bots={bots} 
                selectedBotId={selectedBotId} 
                onSelectBot={handleSelectBot} 
              />
            )}
            
            {/* Action control details (hidden on mobile if no bot is active) */}
            {(!isMobile || selectedBotId) && (
              <div style={{ overflowY: 'auto' }}>
                {activeBot ? (
                  <ActionPanel bot={activeBot} onClose={handleCloseBotPanel} />
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%', 
                    padding: '40px',
                    color: 'var(--text-muted)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '48px', marginBottom: '16px' }}>📱</span>
                    <h3>Nenhum dispositivo selecionado</h3>
                    <p style={{ fontSize: '14px', maxWidth: '300px', marginTop: '8px' }}>
                      Selecione um aparelho na barra lateral esquerda para visualizar a tela, logs do keylogger e enviar comandos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <LiveMap bots={bots} onSelectBot={handleSelectBot} />
        )}

        {activeTab === 'builder' && (
          <PayloadBuilder />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <button 
          className={`mobile-bottom-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setSelectedBotId(null); }}
        >
          <span className="mobile-bottom-icon">📊</span>
          Dashboard
        </button>
        <button 
          className={`mobile-bottom-item ${activeTab === 'bots' ? 'active' : ''}`}
          onClick={() => setActiveTab('bots')}
        >
          <span className="mobile-bottom-icon">📱</span>
          Dispositivos
        </button>
        <button 
          className={`mobile-bottom-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => { setActiveTab('map'); setSelectedBotId(null); }}
        >
          <span className="mobile-bottom-icon">🗺️</span>
          Live Map
        </button>
        <button 
          className={`mobile-bottom-item ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => { setActiveTab('builder'); setSelectedBotId(null); }}
        >
          <span className="mobile-bottom-icon">🛠️</span>
          Compilador
        </button>
      </div>

      {/* Footer information panel */}
      <footer style={{ 
        height: '40px', 
        background: 'rgba(9, 9, 14, 0.95)', 
        borderTop: '1px solid var(--border-color)', 
        display: 'none', // hidden on mobile, desktop handled differently
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 24px',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }} className="desktop-footer">
        <span>BTMob V4 Web Control Panel • Refatorado com React & Supabase</span>
        <span>Status da Conexão: Operacional (Supabase Cloud)</span>
      </footer>
      <style>{`
        @media (min-width: 769px) {
          .desktop-footer { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default App;
