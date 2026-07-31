import React from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { QrCode, ShieldCheck, Store, Smartphone, Sparkles, Database } from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const { currentRole, setCurrentRole, activeTableNumber, setActiveTableNumber, isLiveDB } = useSaaS();

  return (
    <header className="global-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="brand-logo" onClick={() => setCurrentRole('landing')}>
          <QrCode className="w-6 h-6 text-primary" style={{ color: 'var(--primary)' }} />
          <span>Table</span>QR
        </div>

        {isLiveDB && (
          <span style={{
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#4ade80',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Database className="w-3 h-3" /> Live Supabase DB
          </span>
        )}
      </div>

      <nav className="role-switcher">
        <button
          className={`role-btn ${currentRole === 'landing' ? 'active' : ''}`}
          onClick={() => setCurrentRole('landing')}
        >
          <Sparkles className="w-4 h-4" />
          SaaS Pitch
        </button>

        <button
          className={`role-btn ${currentRole === 'superadmin' ? 'active' : ''}`}
          onClick={() => setCurrentRole('superadmin')}
        >
          <ShieldCheck className="w-4 h-4" />
          Super Admin
        </button>

        <button
          className={`role-btn ${currentRole === 'restaurant' ? 'active' : ''}`}
          onClick={() => setCurrentRole('restaurant')}
        >
          <Store className="w-4 h-4" />
          Restaurant Portal
        </button>

        <button
          className={`role-btn ${currentRole === 'customer' ? 'active' : ''}`}
          onClick={() => setCurrentRole('customer')}
        >
          <Smartphone className="w-4 h-4" />
          QR Menu (Table {activeTableNumber})
        </button>
      </nav>

      {currentRole === 'customer' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#94a3b8' }}>Table #:</span>
          <select
            value={activeTableNumber}
            onChange={(e) => setActiveTableNumber(Number(e.target.value))}
            style={{
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '2px 8px',
              fontWeight: '700'
            }}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Table {num}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
};
