import React, { useState } from 'react';
import type { Restaurant } from '../../types';
import { Lock, Phone, KeyRound, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  restaurant: Restaurant;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ restaurant, onLoginSuccess }) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check against registered restaurant phone number OR master passcode 123456
    const cleanPhone = phoneInput.replace(/[^0-9]/g, '');
    const targetPhone = restaurant.phone.replace(/[^0-9]/g, '');

    if (cleanPhone === targetPhone || pinInput === '123456' || phoneInput.trim() === restaurant.phone.trim()) {
      onLoginSuccess();
    } else {
      setErrorMsg(`Invalid credentials. Use registered phone (${restaurant.phone}) or PIN: 123456`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '24px',
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <Lock className="w-8 h-8" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          {restaurant.name}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Restaurant Admin Security Portal
        </p>

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.65rem 1rem',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Phone className="w-3.5 h-3.5" /> Owner Phone Number:
            </label>
            <input
              type="text"
              required
              placeholder={restaurant.phone || "Enter phone number..."}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <KeyRound className="w-3.5 h-3.5" /> Security PIN (Default: 123456):
            </label>
            <input
              type="password"
              placeholder="123456"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
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
              boxShadow: '0 8px 20px rgba(255, 87, 34, 0.4)',
              marginTop: '0.5rem'
            }}
          >
            Access Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
