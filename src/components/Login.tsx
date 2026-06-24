import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase!.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Cadastro efetuado! Verifique seu e-mail para confirmação (se ativo) ou faça login.');
      } else {
        const { error: signInError } = await supabase!.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro no processo de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 60%)',
    }}>
      <div className="glass-panel" style={{
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        border: '1px solid rgba(139, 92, 246, 0.25)',
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--accent-cyan), var(--accent-pink), transparent)',
        }} />

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '48px' }}>🤖</span>
          <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '0.5px' }} className="title-glow">
            BTMob V4 Control Panel
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Acesso Restrito - Autenticação do Operador
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            padding: '10px 12px',
            color: 'var(--danger)',
            fontSize: '13px',
            textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            padding: '10px 12px',
            color: 'var(--success)',
            fontSize: '13px',
            textAlign: 'center',
          }}>
            ✔️ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              E-mail do Operador
            </label>
            <input
              type="email"
              placeholder="operator@btmob.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Chave de Acesso (Senha)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: '8px',
              width: '100%',
              fontSize: '14px',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}
          >
            {loading ? 'Processando...' : isSignUp ? 'Registrar Novo Operador' : 'Autenticar no Painel'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '14px',
        }}>
          {isSignUp ? (
            <span>
              Já possui credenciais?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  padding: 0,
                  font: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  minHeight: 'auto',
                }}
              >
                Faça login
              </button>
            </span>
          ) : (
            <span>
              Novo operador?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  padding: 0,
                  font: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  minHeight: 'auto',
                }}
              >
                Cadastre-se aqui
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
