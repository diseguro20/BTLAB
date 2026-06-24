import React, { useState } from 'react';
import type { Bot, FileEntry } from '../types';
import { StorageService } from '../services/storage';

interface FileManagerProps {
  bot: Bot;
}

export const FileManager: React.FC<FileManagerProps> = ({ bot }) => {
  const [currentPath, setCurrentPath] = useState('/storage/emulated/0');
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  const files = StorageService.getFiles(currentPath);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleBack = () => {
    if (currentPath === '/storage/emulated/0') return;
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
    setSelectedFile(null);
  };

  const handleDelete = (file: FileEntry) => {
    StorageService.addLog('warning', `Comando de deletar arquivo enviado: ${file.name}`, bot.id, bot.name);
    alert(`Comando de deleção enviado para o arquivo: ${file.name}`);
  };

  const handleDownload = (file: FileEntry) => {
    StorageService.addLog('info', `Download iniciado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, bot.id, bot.name);
    alert(`Iniciando download do arquivo: ${file.name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      
      {/* Path Breadcrumb and Navigation actions */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack} 
            disabled={currentPath === '/storage/emulated/0'}
            style={{ padding: '4px 10px', fontSize: '12px', minHeight: '30px', opacity: currentPath === '/storage/emulated/0' ? 0.5 : 1 }}
          >
            ← Voltar
          </button>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
            {currentPath}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              StorageService.addLog('info', `Simulação de upload iniciada.`, bot.id);
              alert("Selecione um arquivo local para enviar...");
            }}
            style={{ padding: '4px 10px', fontSize: '12px', minHeight: '30px' }}
          >
            📤 Enviar
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              const name = prompt("Nome da nova pasta:");
              if (name) {
                StorageService.addLog('info', `Criou pasta: ${name}`, bot.id);
                alert(`Pasta "${name}" criada.`);
              }
            }}
            style={{ padding: '4px 10px', fontSize: '12px', minHeight: '30px' }}
          >
            📁 Nova Pasta
          </button>
        </div>
      </div>

      {/* Main Files Layout Grid */}
      <div className="glass-panel file-manager-grid" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 260px', gap: '16px' }}>
        
        {/* Table View (for Desktop) */}
        <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 6px' }}>Nome</th>
                <th style={{ padding: '10px 6px' }}>Tamanho</th>
                <th style={{ padding: '10px 6px' }}>Modificado</th>
                <th style={{ padding: '10px 6px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr 
                  key={file.name} 
                  onClick={() => setSelectedFile(file)}
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)', 
                    background: selectedFile?.name === file.name ? 'var(--panel-hover)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '10px 6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                    <span style={{ fontSize: '14px' }}>{file.isDir ? '📁' : '📄'}</span>
                    {file.isDir ? (
                      <span 
                        style={{ color: 'var(--accent-purple)', textDecoration: 'underline' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(`${currentPath}/${file.name}`);
                        }}
                      >
                        {file.name}
                      </span>
                    ) : (
                      <span>{file.name}</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 6px', color: 'var(--text-secondary)' }}>
                    {file.isDir ? '--' : `${(file.size / 1024).toFixed(1)} KB`}
                  </td>
                  <td style={{ padding: '10px 6px', color: 'var(--text-muted)' }}>
                    {file.modified}
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                      {!file.isDir && (
                        <button className="btn btn-secondary" onClick={() => handleDownload(file)} style={{ padding: '2px 6px', fontSize: '11px', minHeight: '26px' }}>
                          ⬇️
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => handleDelete(file)} style={{ padding: '2px 6px', fontSize: '11px', color: 'var(--danger)', minHeight: '26px' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card View (for Mobile viewport < 768px) */}
        <div className="mobile-card-grid">
          {files.map(file => (
            <div 
              key={file.name}
              className="mobile-card"
              onClick={() => setSelectedFile(file)}
              style={{
                borderColor: selectedFile?.name === file.name ? 'var(--accent-purple)' : 'var(--border-color)',
                background: selectedFile?.name === file.name ? 'var(--panel-hover)' : 'var(--bg-secondary)',
                padding: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{file.isDir ? '📁' : '📄'}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {file.isDir ? (
                    <span 
                      style={{ color: 'var(--accent-purple)', textDecoration: 'underline', fontWeight: '600', fontSize: '14px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(`${currentPath}/${file.name}`);
                      }}
                    >
                      {file.name}
                    </span>
                  ) : (
                    <span style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)' }}>{file.name}</span>
                  )}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {file.isDir ? 'Diretório' : `${(file.size / 1024).toFixed(1)} KB`} • {file.modified}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                {!file.isDir && (
                  <button className="btn btn-secondary" onClick={() => handleDownload(file)} style={{ padding: '4px 8px', fontSize: '11px', minHeight: '28px' }}>
                    ⬇️ Download
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => handleDelete(file)} style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', minHeight: '28px' }}>
                  🗑️ Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar file info panel */}
        <div className="file-info-sidebar" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Detalhes do Arquivo</h4>
          {selectedFile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)' }}>Nome:</span>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selectedFile.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)' }}>Caminho:</span>
                <span style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>{selectedFile.path}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tamanho:</span>
                <span>{selectedFile.isDir ? 'Diretório' : `${(selectedFile.size / 1024).toFixed(1)} KB`}</span>
              </div>
              
              {/* Text preview simulation */}
              {!selectedFile.isDir && selectedFile.name.endsWith('.txt') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Prévia:</span>
                  <pre style={{ 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    padding: '8px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--success)',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    bradesco: ag 3120 c/c 014522-8 psw: 481903&#10;gmail: carder123@gmail.com psw: 12345678&#10;itau: ag 0455 conta 98223 psw: 9912
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Selecione um arquivo para ver detalhes.</p>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .file-manager-grid {
            grid-template-columns: 1fr !important;
          }
          .file-info-sidebar {
            border-left: none !important;
            border-top: 1px solid var(--border-color) !important;
            padding-left: 0 !important;
            padding-top: 16px !important;
            margin-top: 8px;
          }
        }
        
        @media (min-width: 769px) {
          .desktop-table-view { display: block !important; }
        }
      `}</style>
    </div>
  );
};
