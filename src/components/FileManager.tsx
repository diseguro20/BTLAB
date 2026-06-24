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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
      
      {/* Path Breadcrumb and Navigation actions */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack} 
            disabled={currentPath === '/storage/emulated/0'}
            style={{ padding: '6px 12px', fontSize: '13px', opacity: currentPath === '/storage/emulated/0' ? 0.5 : 1 }}
          >
            ← Voltar
          </button>
          <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            {currentPath}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              StorageService.addLog('info', `Simulação de upload de arquivo iniciada.`, bot.id);
              alert("Selecione um arquivo local para enviar ao dispositivo...");
            }}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            📤 Enviar Arquivo
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              const name = prompt("Digite o nome da nova pasta:");
              if (name) {
                StorageService.addLog('info', `Nova pasta criada: ${name}`, bot.id);
                alert(`Pasta "${name}" criada com sucesso.`);
              }
            }}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            📁 Nova Pasta
          </button>
        </div>
      </div>

      {/* Main Files Table */}
      <div className="glass-panel" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        
        {/* Files list */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px' }}>Nome</th>
                <th style={{ padding: '12px 8px' }}>Tamanho</th>
                <th style={{ padding: '12px 8px' }}>Modificado</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Ações</th>
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
                  onMouseEnter={(e) => {
                    if (selectedFile?.name !== file.name) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFile?.name !== file.name) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                    <span style={{ fontSize: '16px' }}>{file.isDir ? '📁' : '📄'}</span>
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
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                    {file.isDir ? '--' : `${(file.size / 1024).toFixed(1)} KB`}
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                    {file.modified}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                      {!file.isDir && (
                        <button className="btn btn-secondary" onClick={() => handleDownload(file)} style={{ padding: '4px 8px', fontSize: '12px' }}>
                          ⬇️
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => handleDelete(file)} style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--danger)' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar file info panel */}
        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Detalhes do Arquivo</h4>
          {selectedFile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Nome:</span>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selectedFile.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Caminho Completo:</span>
                <span style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>{selectedFile.path}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tamanho:</span>
                <span>{selectedFile.isDir ? 'Diretório de arquivos' : `${(selectedFile.size / 1024).toFixed(1)} KB (${selectedFile.size} bytes)`}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Última Modificação:</span>
                <span>{selectedFile.modified}</span>
              </div>

              {/* Text preview simulation */}
              {!selectedFile.isDir && selectedFile.name.endsWith('.txt') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Prévia do Conteúdo:</span>
                  <pre style={{ 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    padding: '8px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--success)'
                  }}>
                    bradesco: ag 3120 c/c 014522-8 psw: 481903&#10;gmail: carder123@gmail.com psw: 12345678&#10;itau: ag 0455 conta 98223 psw: 9912
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Selecione um arquivo ou pasta para inspecionar os metadados.</p>
          )}
        </div>

      </div>

    </div>
  );
};
