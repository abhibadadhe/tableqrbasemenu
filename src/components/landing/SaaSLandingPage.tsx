import React from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { CheckCircle2, Rocket, DollarSign, Store, ShieldCheck, Smartphone, Zap } from 'lucide-react';

export const SaaSLandingPage: React.FC = () => {
  const { plans, setCurrentRole } = useSaaS();

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1e293b 100%)',
        padding: '4rem 1.5rem 3rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px 18px',
          borderRadius: '30px',
          fontWeight: '800',
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255,87,34,0.3)'
        }}>
          <Rocket className="w-4 h-4" /> Ready-to-Launch White-Label SaaS Platform
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: 1.1, maxWidth: '900px', margin: '0 auto 1.25rem' }}>
          START YOUR OWN <span style={{ color: 'var(--primary)' }}>QR MENU BUSINESS</span> TODAY!
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Launch your own branded Table QR Menu platform and sell subscriptions to restaurants, cafes, hotels, food trucks, bars, and cloud kitchens with 100% white label branding.
        </p>

        {/* Quick Launch Demo Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentRole('superadmin')}
            style={{
              padding: '0.9rem 1.8rem',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 8px 25px rgba(255, 87, 34, 0.4)'
            }}
          >
            <ShieldCheck className="w-5 h-5" /> Test Super Admin Portal
          </button>

          <button
            onClick={() => setCurrentRole('restaurant')}
            style={{
              padding: '0.9rem 1.8rem',
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <Store className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Test Restaurant Dashboard
          </button>

          <button
            onClick={() => setCurrentRole('customer')}
            style={{
              padding: '0.9rem 1.8rem',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <Smartphone className="w-5 h-5 text-success" /> Test Table 12 Mobile QR Menu
          </button>
        </div>
      </section>

      {/* Target Customers & Features Grid */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Target Customers */}
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#ff5722', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Store className="w-5 h-5" /> YOUR TARGET CUSTOMERS
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Restaurants • Cafes • Hotels • Bars • Food Courts • Cloud Kitchens • Bakeries • Resorts • Juice Bars • Home Chefs • Sweet Shops
            </p>
          </div>

          {/* Platform Features */}
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#ff5722', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap className="w-5 h-5" /> PLATFORM FEATURES
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Restaurant Dashboard, Digital QR Menus, Unlimited Menu Items, Categories, Food Images, Pricing, Offers, Analytics, QR Standee Generation, Responsive Mobile Design, Customer Management.
            </p>
          </div>

          {/* Revenue Streams */}
          <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#ff5722', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign className="w-5 h-5" /> REVENUE OPPORTUNITIES
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Monthly Subscriptions, Annual Subscriptions, Setup Fees, Acrylic QR Standee Printing, Menu Upload Services, Premium Support, Website Development, WhatsApp Marketing.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Tiers Section (Exact PDF Copy) */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>PRICING PLANS</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Choose the perfect plan to launch your SaaS software empire.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              background: plan.id === 'pro' ? 'linear-gradient(180deg, #1e293b 0%, #1e1b4b 100%)' : '#1e293b',
              border: plan.id === 'pro' ? '2px solid var(--primary)' : '1px solid #334155',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.id === 'pro' ? '0 15px 35px rgba(255, 87, 34, 0.25)' : 'none'
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '24px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '4px 14px',
                  borderRadius: '12px',
                  letterSpacing: '0.05em'
                }}>
                  {plan.badge}
                </div>
              )}

              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: plan.id === 'pro' ? 'var(--primary)' : '#fff' }}>
                {plan.name.toUpperCase()}
              </h3>

              <div style={{ margin: '1.25rem 0 1.5rem' }}>
                {plan.onboardingFee ? (
                  <div>
                    <span style={{ fontSize: '2rem', fontWeight: '800' }}>₹{plan.onboardingFee}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}> (One-Time Fees)</span>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '2rem', fontWeight: '800' }}>₹{plan.price.toLocaleString()}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}> ({plan.billingCycle})</span>
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', flex: 1 }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    <CheckCircle2 className="w-4 h-4 text-success" style={{ color: '#22c55e', flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setCurrentRole('superadmin')}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: plan.id === 'pro' ? 'var(--primary)' : '#334155',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Get Started Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Banner */}
      <footer style={{
        maxWidth: '1200px',
        margin: '4rem auto 0',
        padding: '2rem 1.5rem',
        borderTop: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
          <span>Table</span><span style={{ color: 'var(--primary)' }}>QR</span> SaaS Platform
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          Contact Support: +91 75052 94392 | tableqr.kyteapps.com
        </div>
      </footer>

    </div>
  );
};
