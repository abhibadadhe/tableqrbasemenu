import React from 'react';
import type { Order, Restaurant } from '../../types';
import { X, Printer } from 'lucide-react';

interface OrderBillPrintModalProps {
  order: Order;
  restaurant: Restaurant;
  onClose: () => void;
  onPrintCompleted?: () => void;
}

export const OrderBillPrintModal: React.FC<OrderBillPrintModalProps> = ({ order, restaurant, onClose, onPrintCompleted }) => {
  const handlePrint = () => {
    window.print();
    if (onPrintCompleted) {
      onPrintCompleted();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bill-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .thermal-receipt-printable, .thermal-receipt-printable * {
            visibility: visible !important;
          }
          .thermal-receipt-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            padding: 10px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            color: #000 !important;
            background: #fff !important;
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 12px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '24px',
        maxWidth: '420px',
        width: '100%',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Order Receipt / Bill
          </h3>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'var(--bg-subtle)', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="thermal-receipt-printable" style={{
          background: '#ffffff',
          color: '#000000',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1',
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          {/* Restaurant Details Header */}
          <div style={{ textAlign: 'center', paddingBottom: '0.75rem', borderBottom: '1px dashed #000' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>
              {restaurant.name}
            </h2>
            <p style={{ fontSize: '0.75rem', margin: '2px 0 0' }}>{restaurant.tagline}</p>
            <p style={{ fontSize: '0.75rem', margin: '2px 0 0' }}>Ph: {restaurant.phone}</p>
            {restaurant.address && <p style={{ fontSize: '0.75rem', margin: '2px 0 0' }}>{restaurant.address}</p>}
          </div>

          {/* Bill Info Bar */}
          <div style={{ padding: '0.6rem 0', borderBottom: '1px dashed #000', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>INVOICE #: {order.id}</span>
              <span>TABLE #: {order.tableNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
              <span>Date: {currentDate}</span>
              <span>Status: {order.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', margin: '0.75rem 0', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>
                <th style={{ paddingBottom: '4px' }}>Item</th>
                <th style={{ paddingBottom: '4px', textAlign: 'center' }}>Qty</th>
                <th style={{ paddingBottom: '4px', textAlign: 'right' }}>Price</th>
                <th style={{ paddingBottom: '4px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                  <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{item.menuItem.name}</td>
                  <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>{restaurant.currency}{item.menuItem.price}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold' }}>{restaurant.currency}{item.menuItem.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Summary */}
          <div style={{ borderTop: '1px dashed #000', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '900' }}>
              <span>GRAND TOTAL:</span>
              <span>{restaurant.currency}{order.totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '2px' }}>
              <span>Payment Mode: Cash / QR Pay</span>
              <span style={{ fontWeight: 'bold' }}>{order.paymentStatus === 'paid' ? 'PAID' : 'DUE'}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #000', fontSize: '0.75rem' }}>
            <p style={{ fontWeight: 'bold' }}>*** THANK YOU FOR DINING! ***</p>
            <p style={{ marginTop: '2px' }}>Powered by TableQR Platform</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              fontWeight: '700',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            style={{
              flex: 2,
              padding: '0.75rem',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(255, 87, 34, 0.4)'
            }}
          >
            <Printer className="w-5 h-5" /> Print Thermal Bill
          </button>
        </div>
      </div>
    </div>
  );
};
