import React, { useState, useRef } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, QrCode, Eye, Utensils, Smartphone } from 'lucide-react';

export const QRStandeeGenerator: React.FC = () => {
  const { currentRestaurant, activeTableNumber, setActiveTableNumber } = useSaaS();
  const [standeeColor, setStandeeColor] = useState<string>(currentRestaurant?.themeColor || '#ff5722');
  const standeeRef = useRef<HTMLDivElement>(null);

  const menuUrl = `${window.location.origin}/?restaurant=${currentRestaurant?.slug || ''}&table=${activeTableNumber}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Printable Table QR Standee Studio</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Generate ready-to-print acrylic standees for your restaurant tables.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(255,87,34,0.3)'
            }}
          >
            <Printer className="w-4 h-4" /> Print Standee
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              Select Table Number:
            </label>
            <select
              value={activeTableNumber}
              onChange={(e) => setActiveTableNumber(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontWeight: '700'
              }}
            >
              {Array.from({ length: currentRestaurant?.tablesCount || 25 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Table {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              Standee Accent Color:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['#ff5722', '#e91e63', '#2563eb', '#16a34a', '#d97706', '#0f172a'].map((col) => (
                <button
                  key={col}
                  onClick={() => setStandeeColor(col)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: col,
                    border: standeeColor === col ? '3px solid var(--text-main)' : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Live QR Target Link:</h4>
            <input
              type="text"
              readOnly
              value={menuUrl}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)'
              }}
            />
          </div>
        </div>

        {/* Printable Standee Display Mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div ref={standeeRef} className="qr-standee-card">
            {/* Logo */}
            <div className="qr-standee-header">
              <div style={{
                background: standeeColor,
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode className="w-5 h-5" />
              </div>
              <span>Table<span style={{ color: standeeColor }}>QR</span></span>
            </div>

            {/* Banner Subtitle */}
            <div className="qr-standee-subtitle" style={{ background: standeeColor }}>
              SCAN TO VIEW OUR MENU
            </div>

            {/* QR Code Container */}
            <div>
              <div className="qr-box-wrapper">
                <QRCodeSVG
                  value={menuUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                  fgColor="#0f172a"
                />
              </div>
            </div>

            {/* Table Number Pill */}
            <div>
              <div className="qr-table-pill" style={{ background: standeeColor }}>
                TABLE {activeTableNumber}
              </div>
            </div>

            {/* Steps bar */}
            <div className="qr-actions-row">
              <div className="qr-action-item">
                <Smartphone className="w-4 h-4" style={{ color: standeeColor }} />
                <span>SCAN</span>
              </div>
              <div className="qr-action-item">
                <Eye className="w-4 h-4" style={{ color: standeeColor }} />
                <span>VIEW</span>
              </div>
              <div className="qr-action-item">
                <Utensils className="w-4 h-4" style={{ color: standeeColor }} />
                <span>ORDER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
