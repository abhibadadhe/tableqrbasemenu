import React, { useState } from 'react';
import type { Restaurant } from '../../types';
import { X, Copy, Check, Printer, ShieldCheck } from 'lucide-react';

interface ClientWelcomeKitModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export const ClientWelcomeKitModal: React.FC<ClientWelcomeKitModalProps> = ({ restaurant, onClose }) => {
  const [copied, setCopied] = useState(false);

  const restSlug = restaurant.slug || restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const adminUrl = `${window.location.origin}/${restSlug}/login`;
  const menuUrl = `${window.location.origin}/${restSlug}?table=1`;

  const kitText = `🎉 WELCOME TO TABLEQR PLATFORM!

Your white-label QR menu system is live and ready for your guests!

📍 RESTAURANT DETAILS:
Restaurant Name: ${restaurant.name}
Plan Tier: ${restaurant.planId.toUpperCase()} Plan
Configured Tables: ${restaurant.tablesCount} Tables

🔑 RESTAURANT OWNER DASHBOARD LOGIN:
Admin Portal: ${adminUrl}
Login Phone: ${restaurant.phone}
Password / Security PIN: ${restaurant.password || '123456'}
Status: ACTIVE

📱 CUSTOMER MOBILE MENU LINK:
Live Menu URL: ${menuUrl}

🖨️ NEXT STEPS:
1. Log in to your Admin Portal above to add/edit menu items and daily offers.
2. Go to the "QR Standee Generator" tab to download & print table standees (Table 1 to Table ${restaurant.tablesCount}).

Need support? Reply to this message or call +91 75052 94392.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(kitText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(5px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-main)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Client Onboarding Welcome Kit</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ready-to-send setup instructions for {restaurant.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ border: 'none', background: 'var(--bg-subtle)', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formatted Kit Content Preview Box */}
        <div style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          maxHeight: '340px',
          overflowY: 'auto',
          marginBottom: '1.5rem',
          color: 'var(--text-main)'
        }}>
          {kitText}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Printer className="w-4 h-4" /> Print Handover Page
          </button>

          <button
            onClick={handleCopy}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: copied ? 'var(--success)' : 'var(--primary)',
              color: '#fff',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(255,87,34,0.3)'
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Welcome Kit'}
          </button>
        </div>

      </div>
    </div>
  );
};
