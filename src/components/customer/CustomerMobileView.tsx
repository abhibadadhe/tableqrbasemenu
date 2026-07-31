import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { Search, Moon, Sun, ShoppingBag, Plus, Minus, Sparkles, X, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerMobileView: React.FC = () => {
  const {
    currentRestaurant,
    currentCategories,
    currentMenuItems,
    currentOffers,
    activeTableNumber,
    darkMode,
    setDarkMode,
    cartItems,
    addToCart,
    updateQuantity,
    placeOrder,
    orders
  } = useSaaS();

  if (!currentRestaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No Active Restaurant Found</h2>
        <p style={{ marginTop: '0.5rem' }}>Please scan a valid table QR code or onboard a restaurant in Super Admin.</p>
      </div>
    );
  }

  const [selectedCatId, setSelectedCatId] = useState<string>('cat-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegFilter, setVegFilter] = useState<'both' | 'veg' | 'nonveg'>('both');
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);

  // Deduplicate categories by normalized name
  const uniqueCategories = currentCategories.filter((cat, index, self) =>
    index === self.findIndex((c) => c.name.toLowerCase().trim() === cat.name.toLowerCase().trim())
  );

  // Filter items
  const filteredItems = currentMenuItems.filter((item) => {
    const matchesCat = selectedCatId === 'cat-all' || item.categoryId === selectedCatId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVeg = vegFilter === 'both' ? true : vegFilter === 'veg' ? item.isVeg : !item.isVeg;

    return matchesCat && matchesSearch && matchesVeg;
  });

  const cartTotalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotalAmount = cartItems.reduce((acc, curr) => acc + (curr.menuItem.price * curr.quantity), 0);
  const activeOrdersForTable = orders
    .filter(o => o.tableNumber === activeTableNumber)
    .filter((o, index, self) => index === self.findIndex(item => item.id === o.id));

  const handleCheckout = () => {
    const newOrd = placeOrder();
    if (newOrd) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setShowCartDrawer(false);
      setShowOrdersModal(true);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`} style={{ paddingBottom: '3rem' }}>
      <div className="mobile-wrapper">
        
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="restaurant-badge">
            <img src={currentRestaurant.logo} alt={currentRestaurant.name} className="restaurant-avatar" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Table</span>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.1rem' }}>QR</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Table #{activeTableNumber}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                border: 'none',
                background: 'var(--bg-subtle)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              {darkMode ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowOrdersModal(true)}
              style={{
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <ShoppingBag className="w-4 h-4 text-primary" style={{ color: 'var(--primary)' }} />
              My Orders
              {activeOrdersForTable.length > 0 && (
                <span style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {activeOrdersForTable.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="welcome-title">
          Welcome to <span>{currentRestaurant.name}!</span>
        </div>

        {/* Promotional Offer Banner */}
        {currentOffers.length > 0 && (
          <div className="offer-banner-card" style={{ background: currentOffers[0].bgColor }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', opacity: 0.9 }}>
                <Sparkles className="w-4 h-4" /> Limited Special Offer
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '2px' }}>
                {currentOffers[0].title}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
                Code: {currentOffers[0].code}
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(4px)',
              padding: '6px 14px',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '0.85rem'
            }}>
              {currentOffers[0].discount}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-box">
          <Search className="search-icon w-4 h-4" />
          <input
            type="text"
            placeholder="Search for dishes..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        {uniqueCategories.length > 0 && (
          <div className="category-pills">
            <button
              className={`cat-pill ${selectedCatId === 'cat-all' ? 'active' : ''}`}
              onClick={() => setSelectedCatId('cat-all')}
            >
              All Dishes
            </button>
            {uniqueCategories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${selectedCatId === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCatId(cat.id)}
              >
                {cat.name === 'Tandoor' && '🔥 '}
                {cat.name === 'Kurkure Buck' && '🍟 '}
                {cat.name === 'Starters' && '🥗 '}
                {cat.name === 'Beverages' && '🥤 '}
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Veg / Non-Veg Toggle Pills */}
        <div className="filter-toggle-row">
          <button
            className={`filter-toggle-btn ${vegFilter === 'both' ? 'active' : ''}`}
            onClick={() => setVegFilter('both')}
          >
            Both
          </button>
          <button
            className={`filter-toggle-btn ${vegFilter === 'veg' ? 'active' : ''}`}
            onClick={() => setVegFilter('veg')}
          >
            <span className="food-type-icon veg"></span> Veg Only
          </button>
          <button
            className={`filter-toggle-btn ${vegFilter === 'nonveg' ? 'active' : ''}`}
            onClick={() => setVegFilter('nonveg')}
          >
            <span className="food-type-icon nonveg"></span> Non-Veg Only
          </button>
        </div>

        {/* Menu Items List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: cartTotalCount > 0 ? '80px' : '20px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              No dishes found matching your selection.
            </div>
          ) : (
            filteredItems.map((dish) => (
              <div key={dish.id} className="dish-card">
                <div className="dish-details">
                  <div className="dish-title-row">
                    <span className={`food-type-icon ${dish.isVeg ? 'veg' : 'nonveg'}`}></span>
                    <span className="dish-name">{dish.name}</span>
                  </div>

                  <div className="dish-price">
                    {currentRestaurant.currency}{dish.price}
                  </div>

                  <p className="dish-desc">{dish.description}</p>

                  <div className="dish-tags">
                    {dish.tags.map((tag, idx) => (
                      <span key={idx} className="tag-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dish-img-wrapper">
                  <img src={dish.image} alt={dish.name} className="dish-img" />
                  <button
                    className="add-btn"
                    onClick={() => addToCart(dish)}
                    title="Add to Table Order"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Cart Sticky Drawer Footer */}
        {cartTotalCount > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '20px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(255, 87, 34, 0.4)',
            cursor: 'pointer',
            zIndex: 10
          }} onClick={() => setShowCartDrawer(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '6px 12px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>
                {cartTotalCount} {cartTotalCount === 1 ? 'Item' : 'Items'}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Table #{activeTableNumber} Order</div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{currentRestaurant.currency}{cartTotalAmount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '800', fontSize: '0.95rem' }}>
              View Cart <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        )}

      </div>

      {/* Cart Modal / Drawer */}
      {showCartDrawer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }} onClick={() => setShowCartDrawer(false)}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-card)',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            padding: '1.5rem',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
            borderTop: '1px solid var(--border-color)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Your Table {activeTableNumber} Order</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cartItems.length} dish types selected</span>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                style={{ border: 'none', background: 'var(--bg-subtle)', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-main)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cartItems.map((item) => (
                <div key={item.menuItem.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: '14px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.menuItem.name}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.9rem' }}>
                      {currentRestaurant.currency}{item.menuItem.price * item.quantity}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '20px' }}>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, -1)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-main)' }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span style={{ fontWeight: '800', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, 1)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-main)' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem' }}>
                <span>Total Payable:</span>
                <span style={{ color: 'var(--primary)' }}>{currentRestaurant.currency}{cartTotalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(255, 87, 34, 0.4)'
              }}
            >
              Send Order to Kitchen (Table {activeTableNumber})
            </button>
          </div>
        </div>
      )}

      {/* Orders Tracking Modal */}
      {showOrdersModal && (
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
        }} onClick={() => setShowOrdersModal(false)}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Table {activeTableNumber} Orders</h3>
              <button
                onClick={() => setShowOrdersModal(false)}
                style={{ border: 'none', background: 'var(--bg-subtle)', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-main)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeOrdersForTable.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No active orders placed for Table {activeTableNumber} yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
                {activeOrdersForTable.map((ord) => (
                  <div key={ord.id} style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1rem',
                    background: 'var(--bg-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{ord.id}</span>
                      <span style={{
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: ord.status === 'placed' ? '#fef3c7' : ord.status === 'preparing' ? '#dbeafe' : '#dcfce7',
                        color: ord.status === 'placed' ? '#b45309' : ord.status === 'preparing' ? '#1d4ed8' : '#15803d'
                      }}>
                        {ord.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      {ord.items.map((i, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{i.quantity}x {i.menuItem.name}</span>
                          <span>{currentRestaurant.currency}{i.menuItem.price * i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                      <span>Total:</span>
                      <span>{currentRestaurant.currency}{ord.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
