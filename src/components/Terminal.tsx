import React, { useState, useRef, useEffect } from 'react';
import type { Bot } from '../types';
import { StorageService } from '../services/storage';

interface TerminalProps {
  bot: Bot;
}

interface ConsoleLine {
  type: 'input' | 'output';
  text: string;
}

export const Terminal: React.FC<TerminalProps> = ({ bot }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ConsoleLine[]>([
    { type: 'output', text: `Conectado ao dispositivo: ${bot.name} [ID: ${bot.id}]` },
    { type: 'output', text: `Conexão ADB estabelecida via IP: ${bot.ip}` },
    { type: 'output', text: `Digite 'help' para listar os comandos disponíveis no console.` },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userCommand = input.trim();
    const newHistory = [...history, { type: 'input' as const, text: userCommand }];
    
    setInput('');
    setHistory(newHistory);

    // Call service to get command output
    setTimeout(() => {
      const output = StorageService.runShellCommand(bot.id, userCommand);
      setHistory(prev => [...prev, { type: 'output' as const, text: output }]);
    }, 100);
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div className="terminal-window">
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="terminal-dot terminal-dot-red"></span>
            <span className="terminal-dot terminal-dot-yellow"></span>
            <span className="terminal-dot terminal-dot-green"></span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            adb shell @ {bot.id}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>● ONLINE</span>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          {history.map((line, index) => (
            <div key={index} style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
              {line.type === 'input' ? (
                <div>
                  <span className="terminal-prompt">shell@android:~$</span>{' '}
                  <span style={{ color: '#fff' }}>{line.text}</span>
                </div>
              ) : (
                <div style={{ color: '#22c55e' }}>{line.text}</div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form onSubmit={handleSubmit} style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px', background: '#09090d' }}>
          <div className="terminal-input-line">
            <span className="terminal-prompt" style={{ fontSize: '13px', fontWeight: 'bold' }}>shell@android:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input-box"
              placeholder="Digite o comando shell..."
              autoFocus
            />
          </div>
        </form>
      </div>

      {/* Helper panel */}
      <div className="glass-panel" style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <strong>Comandos Rápidos sugeridos:</strong>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {['help', 'ls /storage/emulated/0', 'getprop ro.product.name', 'pm list packages', 'dumpsys battery', 'reboot'].map(cmd => (
            <button
              key={cmd}
              onClick={() => setInput(cmd)}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
