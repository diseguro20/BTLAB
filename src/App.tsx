import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import type { Bot, ActionLog } from './types';

import { Dashboard } from './components/Dashboard';
import { DeviceList } from './components/DeviceList';
import { ActionPanel } from './components/ActionPanel';
import { PayloadBuilder } from './components/PayloadBuilder';
import { LiveMap } from './components/LiveMap';

type NavigationTab = 'dashboard' | 'bots' | 'map' | 'builder';

function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  
  // State from storage
  const [bots, setBots] = useState<Bot[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);

  // Initialize and subscribe to state updates
  useEffect(() => {
    // Initial fetch
    setBots(StorageService.getBots());
    setLogs(StorageService.getLogs());

    // Subscription
    const unsubscribe = StorageService.subscribe(() => {
      setBots(StorageService.getBots());
      setLogs(StorageService.getLogs());
    });

    // Start background activity simulator
    const stopSimulator = StorageService.startSimulator();

    return () => {
      unsubscribe();
      stopSimulator();
    };
  }, []);

  const handleSelectBot = (botId: string) => {
    setSelectedBotId(botId);
    setActiveTab('bots');
  };

  const handleCloseBotPanel = () => {
    setSelectedBotId(null);
  };

  const activeBot = bots.find(b => b.id === selectedBotId);

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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Servidor Conectado</span>
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
            {/* Sidebar list */}
            <DeviceList 
              bots={bots} 
              selectedBotId={selectedBotId} 
              onSelectBot={handleSelectBot} 
            />
            
            {/* Action control details */}
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
          </div>
        )}

        {activeTab === 'map' && (
          <LiveMap bots={bots} onSelectBot={handleSelectBot} />
        )}

        {activeTab === 'builder' && (
          <PayloadBuilder />
        )}
      </main>

      {/* Footer information panel */}
      <footer style={{ 
        height: '40px', 
        background: 'rgba(9, 9, 14, 0.95)', 
        borderTop: '1px solid var(--border-color)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 24px',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        <span>BTMob V4 Web Control Panel • Refatorado com React & TypeScript</span>
        <span>Status da Conexão: Simulado (127.0.0.1)</span>
      </footer>
    </>
  );
}

export default App;
