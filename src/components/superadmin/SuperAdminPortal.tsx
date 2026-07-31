import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { Building2, DollarSign, TrendingUp, Users, Plus, ShieldCheck, ExternalLink, FileText } from 'lucide-react';
import { ClientWelcomeKitModal } from './ClientWelcomeKitModal';
import { SuperAdminLoginModal } from '../auth/SuperAdminLoginModal';
import type { Restaurant } from '../../types';

export const SuperAdminPortal: React.FC = () => {
  const { restaurants, addRestaurantTenant, updateTenantStatus, setActiveRestaurantId, setCurrentRole, isSuperAdminAuthenticated } = useSaaS();

  if (!isSuperAdminAuthenticated) {
    return <SuperAdminLoginModal />;
  }
  const [showAddTenantModal, setShowAddTenantModal] = useState<boolean>(false);
  const [selectedKitRestaurant, setSelectedKitRestaurant] = useState<Restaurant | null>(null);

  // New Tenant Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState<'starter' | 'pro' | 'business'>('pro');

  const totalPlatformRevenue = restaurants.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalOrders = restaurants.reduce((acc, curr) => acc + curr.totalOrdersCount, 0);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addRestaurantTenant({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      tagline: tagline || 'Branded Table QR Restaurant',
      address: '100 Business Parkway, Central City',
      phone: phone || '+91 90000 00000',
      whatsapp: phone || '+91 90000 00000',
      currency: '₹',
      themeColor: '#ff5722',
      planId,
      status: 'active',
      tablesCount: 20
    });

    setName('');
    setTagline('');
    setPhone('');
    setShowAddTenantModal(false);
  };

  return (
    <div className="app-container" style={{ padding: '1.5rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#fff',
        padding: '2rem',
        borderRadius: '24px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.9rem' }}>
            <ShieldCheck className="w-5 h-5" /> SaaS PLATFORM OWNER CONTROL CENTER
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>TableQR SaaS Engine Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage white-label restaurant tenants, subscription revenue, and platform licensing.
          </p>
        </div>

        <button
          onClick={() => setShowAddTenantModal(true)}
          style={{
            padding: '0.75rem 1.4rem',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 20px rgba(255,87,34,0.4)'
          }}
        >
          <Plus className="w-5 h-5" /> Onboard New Restaurant
        </button>
      </div>

      {/* Metric Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon"><Building2 /></div>
          <div>
            <div className="stat-value">{restaurants.length}</div>
            <div className="stat-label">Active Restaurant Tenants</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><DollarSign /></div>
          <div>
            <div className="stat-value">₹{(totalPlatformRevenue * 0.15).toLocaleString()}</div>
            <div className="stat-label">Estimated SaaS Monthly Earnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><TrendingUp /></div>
          <div>
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">Orders Processed Across Platform</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Users /></div>
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">White-Label Status</div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem' }}>Subscribed Restaurant Tenants</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Restaurant</th>
                <th style={{ padding: '0.75rem 1rem' }}>Subscription Plan</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tables</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Sales</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((rest) => (
                <tr key={rest.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={rest.logo} alt={rest.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '800' }}>{rest.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rest.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: rest.planId === 'business' ? '#f3e8ff' : rest.planId === 'pro' ? '#dbeafe' : '#fef3c7',
                      color: rest.planId === 'business' ? '#6b21a8' : rest.planId === 'pro' ? '#1e40af' : '#92400e'
                    }}>
                      {rest.planId}
                    </span>
                  </td>

                  <td style={{ padding: '1rem', fontWeight: '700' }}>{rest.tablesCount} Tables</td>

                  <td style={{ padding: '1rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {rest.currency}{rest.totalRevenue.toLocaleString()}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: rest.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: rest.status === 'active' ? '#15803d' : '#b91c1c'
                    }}>
                      {rest.status.toUpperCase()}
                    </span>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedKitRestaurant(rest)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FileText className="w-3 h-3" /> Welcome Kit
                      </button>

                      <button
                        onClick={() => {
                          setActiveRestaurantId(rest.id);
                          setCurrentRole('restaurant');
                        }}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-subtle)',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Launch Portal <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => updateTenantStatus(rest.id, rest.status === 'active' ? 'suspended' : 'active')}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: rest.status === 'active' ? '#fee2e2' : '#dcfce7',
                          color: rest.status === 'active' ? '#b91c1c' : '#15803d',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {rest.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Modal */}
      {showAddTenantModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>Onboard New Restaurant Tenant</h3>
            <form onSubmit={handleCreateTenant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Restaurant Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Punjab Dhaba"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Tagline / Speciality:</label>
                <input
                  type="text"
                  placeholder="Authentic North Indian & Tandoor"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Contact Phone / WhatsApp:</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Select Plan Tier:</label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value as any)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                >
                  <option value="starter">Starter Plan (₹1999 + 50% commission)</option>
                  <option value="pro">Pro Plan (₹6999/yr - 100% white label)</option>
                  <option value="business">Business Plan (₹24999 - Full Codebase)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                >
                  Onboard Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedKitRestaurant && (
        <ClientWelcomeKitModal
          restaurant={selectedKitRestaurant}
          onClose={() => setSelectedKitRestaurant(null)}
        />
      )}
    </div>
  );
};
