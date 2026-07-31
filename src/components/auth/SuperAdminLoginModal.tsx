import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export const SuperAdminLoginModal: React.FC = () => {
  const { loginSuperAdmin } = useSaaS();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginSuperAdmin(email, password);
    if (!success) {
      setErrorMsg('Invalid Super Admin credentials. Use admin@tableqr.com / admin123 or PIN 123456');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      color: '#fff'
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '28px',
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        border: '1px solid #334155'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 87, 34, 0.15)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Super Admin Portal</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            SaaS Provider Platform Management Login
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '14px',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1.25rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1' }}>
              <Mail className="w-4 h-4" /> Admin Email:
            </label>
            <input
              type="text"
              required
              placeholder="admin@tableqr.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1' }}>
              <Lock className="w-4 h-4" /> Password or Master PIN:
            </label>
            <input
              type="password"
              required
              placeholder="admin123 or 123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.95rem',
              borderRadius: '14px',
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 25px rgba(255, 87, 34, 0.4)',
              marginTop: '0.5rem'
            }}
          >
            Login to Super Admin Portal <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
