import React from 'react';
import type { Bot } from '../types';

interface LiveMapProps {
  bots: Bot[];
  onSelectBot: (botId: string) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ bots, onSelectBot }) => {
  const activeBots = bots.filter(b => b.status === 'online');

  // Coordinates array for visualization markers placement
  const locations = [
    { top: '68%', left: '41%', label: 'São Paulo, BR', ip: '189.6.120.45' },
    { top: '55%', left: '38%', label: 'Brasília, BR', ip: '177.34.82.115' },
    { top: '61%', left: '44%', label: 'Rio de Janeiro, BR', ip: '201.86.15.220' },
    { top: '35%', left: '60%', label: 'Nova York, US', ip: '72.210.8.190' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }} className="title-glow">
          Mapa de Geolocalização
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Visualização espacial da distribuição geográfica dos dispositivos infectados e monitorados em tempo real.
        </p>
      </div>

      <div className="glass-panel" style={{ 
        padding: '12px', 
        height: '520px', 
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-color)'
      }}>
        {/* World map vector layout graph mockup */}
        <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%', opacity: 0.15 }}>
          <path fill="var(--text-primary)" d="M150,150 Q180,100 250,120 T350,180 T500,120 T650,200 T800,100 T900,180 L900,400 L100,400 Z" />
          <path fill="var(--text-primary)" d="M200,320 Q220,280 260,300 T300,340 T420,300 T580,360 T700,280 T850,330 T950,280 L950,480 L150,480 Z" opacity="0.3" />
        </svg>

        {/* Location Markers */}
        {activeBots.map((bot, idx) => {
          const loc = locations[idx % locations.length];
          return (
            <div 
              key={bot.id}
              onClick={() => onSelectBot(bot.id)}
              style={{
                position: 'absolute',
                top: loc.top,
                left: loc.left,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: 'rgba(9, 9, 14, 0.85)',
                border: '1px solid var(--accent-purple)',
                padding: '6px 12px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-pink)';
                e.currentTarget.style.boxShadow = '0 0 12px var(--accent-pink-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-purple)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
              }}
            >
              {/* Pulse circle */}
              <div style={{ position: 'relative', width: '12px', height: '12px' }}>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--accent-pink)',
                  animation: 'pulse-glow 1.5s infinite'
                }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>{bot.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{loc.label} • {loc.ip}</span>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ 
          position: 'absolute', 
          bottom: '16px', 
          left: '16px', 
          background: 'rgba(9,9,14,0.9)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-pink)' }} />
            <span>Dispositivo Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span>Dispositivo Offline (Não exibido no mapa)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
