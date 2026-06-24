import React, { useState } from 'react';
import type { Bot } from '../types';

interface DeviceListProps {
  bots: Bot[];
  selectedBotId: string | null;
  onSelectBot: (botId: string) => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({ bots, selectedBotId, onSelectBot }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(search.toLowerCase()) || 
                          bot.ip.includes(search) || 
                          bot.tag.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'online') return matchesSearch && bot.status === 'online';
    if (filter === 'offline') return matchesSearch && bot.status === 'offline';
    return matchesSearch;
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: 'var(--bg-secondary)', 
      borderRight: '1px solid var(--border-color)' 
    }}>
      {/* Search and Filters Header */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>Dispositivos</h3>
        
        <input 
          type="text" 
          placeholder="Buscar por nome, IP ou tag..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', fontSize: '14px' }}
        />

        <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ 
              flex: 1, 
              padding: '6px 8px', 
              fontSize: '12px', 
              background: filter === 'all' ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
              color: 'white',
              border: filter === 'all' ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
            }}
          >
            Todos ({bots.length})
          </button>
          <button 
            onClick={() => setFilter('online')}
            style={{ 
              flex: 1, 
              padding: '6px 8px', 
              fontSize: '12px', 
              background: filter === 'online' ? 'var(--success)' : 'var(--bg-tertiary)',
              color: 'white',
              border: filter === 'online' ? '1px solid var(--success)' : '1px solid var(--border-color)',
            }}
          >
            Online ({bots.filter(b => b.status === 'online').length})
          </button>
          <button 
            onClick={() => setFilter('offline')}
            style={{ 
              flex: 1, 
              padding: '6px 8px', 
              fontSize: '12px', 
              background: filter === 'offline' ? 'var(--text-muted)' : 'var(--bg-tertiary)',
              color: 'white',
              border: filter === 'offline' ? '1px solid var(--text-muted)' : '1px solid var(--border-color)',
            }}
          >
            Offline ({bots.filter(b => b.status === 'offline').length})
          </button>
        </div>
      </div>

      {/* Bot Cards Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredBots.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Nenhum dispositivo encontrado.</p>
        ) : (
          filteredBots.map(bot => {
            const isSelected = selectedBotId === bot.id;
            const flagEmoji = bot.countryCode === 'BR' ? '🇧🇷' : '🇺🇸';
            
            return (
              <div
                key={bot.id}
                onClick={() => onSelectBot(bot.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: isSelected ? 'var(--panel-hover)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid var(--accent-purple)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 8px rgba(139, 92, 246, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Header line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{flagEmoji}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                        {bot.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {bot.model}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${bot.status === 'online' ? 'badge-online' : 'badge-offline'}`} style={{ padding: '2px 6px', fontSize: '10px' }}>
                    {bot.status}
                  </span>
                </div>

                {/* Info summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>IP: {bot.ip}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🔋</span>
                    <span style={{ color: bot.battery <= 20 ? 'var(--danger)' : 'inherit' }}>
                      {bot.battery}% {bot.batteryCharging ? '⚡' : ''}
                    </span>
                  </div>
                </div>

                {/* Footer tags */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', fontSize: '11px' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '500' }}>🏷️ {bot.tag}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Ativo: {bot.lastActive}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
