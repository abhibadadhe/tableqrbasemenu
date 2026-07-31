import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { Phone, KeyRound, ArrowRight, Store, AlertCircle } from 'lucide-react';

export const RestaurantLoginModal: React.FC = () => {
  const { restaurants, currentRestaurant, loginRestaurant } = useSaaS();
  
  const [phoneInput, setPhoneInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const targetRestaurant = currentRestaurant || (restaurants.length > 0 ? restaurants[0] : undefined);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetRestaurant) {
      setErrorMsg('No restaurant found. Please onboard a restaurant in Super Admin first.');
      return;
    }

    const success = loginRestaurant(targetRestaurant.id, phoneInput, pinInput);
    if (!success) {
      setErrorMsg(`Invalid credentials. Check registered Phone (${targetRestaurant.phone}) and Password / PIN.`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      color: '#fff'
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '28px',
        maxWidth: '460px',
        width: '100%',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        border: '1px solid #334155',
        textAlign: 'center'
      }}>
        {targetRestaurant?.logo ? (
          <img
            src={targetRestaurant.logo}
            alt={targetRestaurant.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', margin: '0 auto 1rem' }}
          />
        ) : (
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 87, 34, 0.15)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Store className="w-8 h-8" />
          </div>
        )}

        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
          {targetRestaurant ? targetRestaurant.name : 'Restaurant Admin Login'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 1.5rem' }}>
          Restaurant Management Portal Security Access
        </p>

        {!targetRestaurant ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '1.25rem',
            borderRadius: '16px',
            fontSize: '0.9rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <AlertCircle className="w-6 h-6 text-danger" style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <strong>No Restaurant Found</strong>
              <p style={{ fontSize: '0.8rem', marginTop: '4px', color: '#cbd5e1' }}>
                Please log into the <strong>Super Admin Portal</strong> to onboard your restaurant.
              </p>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                fontSize: '0.8rem',
                fontWeight: '700',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1' }}>
                  <Phone className="w-4 h-4" /> Registered Phone Number:
                </label>
                <input
                  type="text"
                  required
                  placeholder={targetRestaurant.phone || "e.g. 9876543210"}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
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
                  <KeyRound className="w-4 h-4" /> Admin Password / PIN:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your restaurant password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
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
                Access Kitchen & Menu Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
