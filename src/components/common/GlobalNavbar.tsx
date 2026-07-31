import React from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { QrCode, ShieldCheck, Sparkles, Database, LogOut, Store } from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeTableNumber,
    isLiveDB,
    isSuperAdminAuthenticated,
    logoutSuperAdmin,
    authenticatedRestaurantId,
    logoutRestaurant,
    currentRestaurant
  } = useSaaS();

  // 1. Customer Mobile QR View
  if (currentRole === 'customer') {
    return (
      <header className="global-nav">
        <div className="brand-logo">
          <QrCode className="w-6 h-6 text-primary" style={{ color: 'var(--primary)' }} />
          <span>Table</span>QR
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            background: 'rgba(255, 87, 34, 0.15)',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            📍 Table #{activeTableNumber}
          </span>
        </div>
      </header>
    );
  }

  // 2. Restaurant Portal / Restaurant Login View - NO SaaS Pitch or Super Admin tabs!
  if (currentRole === 'restaurant') {
    return (
      <header className="global-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-logo">
            <QrCode className="w-6 h-6 text-primary" style={{ color: 'var(--primary)' }} />
            <span>Table</span>QR
          </div>

          {currentRestaurant && (
            <span style={{
              background: 'rgba(255, 87, 34, 0.15)',
              color: 'var(--primary)',
              border: '1px solid rgba(255, 87, 34, 0.3)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Store className="w-4 h-4" /> {currentRestaurant.name} Admin Portal
            </span>
          )}
        </div>

        <nav className="role-switcher">
          {authenticatedRestaurantId && (
            <button
              className="role-btn"
              onClick={logoutRestaurant}
              style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut className="w-4 h-4" /> Logout Restaurant
            </button>
          )}
        </nav>
      </header>
    );
  }

  // 3. Super Admin View (when on /superadmin route) - NO SaaS Pitch tab!
  if (currentRole === 'superadmin') {
    return (
      <header className="global-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-logo">
            <QrCode className="w-6 h-6 text-primary" style={{ color: 'var(--primary)' }} />
            <span>Table</span>QR
          </div>

          <span style={{
            background: 'rgba(255, 87, 34, 0.15)',
            color: 'var(--primary)',
            border: '1px solid rgba(255, 87, 34, 0.3)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck className="w-4 h-4" /> Super Admin Control Center
          </span>
        </div>

        <nav className="role-switcher">
          {isSuperAdminAuthenticated && (
            <button
              className="role-btn"
              onClick={logoutSuperAdmin}
              style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut className="w-4 h-4" /> Logout Admin
            </button>
          )}
        </nav>
      </header>
    );
  }

  // 4. Public SaaS Landing Homepage (Clean - No Super Admin or internal tabs!)
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
          className="role-btn active"
          onClick={() => setCurrentRole('landing')}
        >
          <Sparkles className="w-4 h-4" />
          SaaS Pitch
        </button>
      </nav>
    </header>
  );
};
