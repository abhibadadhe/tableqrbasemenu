import React, { useState } from 'react';
import { useSaaS } from '../../context/SaaSContext';
import { QRStandeeGenerator } from './QRStandeeGenerator';
import { RestaurantLoginModal } from '../auth/RestaurantLoginModal';
import { Plus, Trash2, Pencil, ToggleLeft, ToggleRight, QrCode, Utensils, DollarSign, Clock, LogOut } from 'lucide-react';
import type { MenuItem } from '../../types';

export const RestaurantAdminPortal: React.FC = () => {
  const {
    currentRestaurant,
    currentCategories,
    currentMenuItems,
    orders,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    addCategory,
    updateOrderStatus,
    authenticatedRestaurantId,
    logoutRestaurant
  } = useSaaS();

  if (!currentRestaurant || !authenticatedRestaurantId || authenticatedRestaurantId !== currentRestaurant.id) {
    return <RestaurantLoginModal />;
  }

  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'qr'>('menu');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [newCatName, setNewCatName] = useState<string>('');

  const uniqueCategories = currentCategories.filter((c, index, self) =>
    index === self.findIndex(cat => cat.name.toLowerCase().trim() === c.name.toLowerCase().trim())
  );

  const restaurantOrders = orders.filter(o => o.restaurantId === currentRestaurant.id);
  const activeLiveOrders = restaurantOrders.filter(o => o.status !== 'completed');
  const completedOrders = restaurantOrders.filter(o => o.status === 'completed');
  const totalSalesRevenue = completedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState(currentCategories[0]?.id || 'cat-all');
  const [tagsInput, setTagsInput] = useState('');
  const [isVeg, setIsVeg] = useState(true);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    addMenuItem({
      name,
      price: Number(price),
      description: description || 'Delicious freshly prepared dish.',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      categoryId,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      isVeg,
      isAvailable: true
    });

    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setTagsInput('');
    setShowAddModal(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName) {
      addCategory(newCatName);
      setNewCatName('');
    }
  };

  return (
    <div className="app-container" style={{ padding: '1.5rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#fff',
        padding: '1.75rem 2rem',
        borderRadius: '24px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img src={currentRestaurant.logo} alt={currentRestaurant.name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--primary)', objectFit: 'cover' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{currentRestaurant.name}</h1>
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '12px'
              }}>
                {currentRestaurant.planId.toUpperCase()} PLAN
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>{currentRestaurant.tagline}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', padding: '6px', borderRadius: '16px', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              border: 'none',
              background: activeTab === 'menu' ? 'var(--primary)' : 'transparent',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Utensils className="w-4 h-4" /> Menu Builder ({currentMenuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              border: 'none',
              background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Clock className="w-4 h-4" /> Live Orders ({activeLiveOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            style={{
              border: 'none',
              background: activeTab === 'qr' ? 'var(--primary)' : 'transparent',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <QrCode className="w-4 h-4" /> QR Standee Generator
          </button>

          <button
            onClick={logoutRestaurant}
            title="Log Out"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon"><Utensils /></div>
          <div>
            <div className="stat-value">{currentMenuItems.length}</div>
            <div className="stat-label">Active Menu Items</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Clock /></div>
          <div>
            <div className="stat-value">{restaurantOrders.length}</div>
            <div className="stat-label">Total Orders Processed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><DollarSign /></div>
          <div>
            <div className="stat-value">{currentRestaurant.currency}{totalSalesRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Sales Revenue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><QrCode /></div>
          <div>
            <div className="stat-value">{currentRestaurant.tablesCount}</div>
            <div className="stat-label">Configured QR Tables</div>
          </div>
        </div>
      </div>

      {/* Tab 1: Menu Engineering */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Menu & Dish Management</h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="New Category Name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{
                    padding: '0.5rem 0.8rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 0.9rem',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                >
                  + Add Category
                </button>
              </form>

              <button
                onClick={() => setShowAddModal(true)}
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
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(255,87,34,0.3)'
                }}
              >
                <Plus className="w-4 h-4" /> Add Dish Item
              </button>
            </div>
          </div>

          {/* Dish Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {currentMenuItems.map((dish) => (
              <div key={dish.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <img src={dish.image} alt={dish.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={`food-type-icon ${dish.isVeg ? 'veg' : 'nonveg'}`}></span>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{dish.name}</h3>
                      </div>
                      <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1rem', marginTop: '2px' }}>
                        {currentRestaurant.currency}{dish.price}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => setEditingDish(dish)}
                        style={{ border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}
                        title="Edit Dish"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteMenuItem(dish.id)}
                        style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.4rem 0' }}>
                    {dish.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {dish.tags.map((t, i) => (
                        <span key={i} className="tag-badge">{t}</span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleItemAvailability(dish.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: dish.isAvailable ? 'var(--success)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}
                    >
                      {dish.isAvailable ? <ToggleRight className="w-5 h-5 text-success" /> : <ToggleLeft className="w-5 h-5" />}
                      {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Live Orders Board */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.25rem' }}>Live Kitchen Order Board</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {restaurantOrders.map((ord) => (
              <div key={ord.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>{ord.id}</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Table #{ord.tableNumber}</div>
                  </div>

                  <select
                    value={ord.status}
                    disabled={ord.status === 'completed'}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      border: '1px solid var(--border-color)',
                      background: ord.status === 'placed' ? '#fef3c7' : ord.status === 'preparing' ? '#dbeafe' : ord.status === 'served' ? '#e0e7ff' : '#dcfce7',
                      color: ord.status === 'placed' ? '#b45309' : ord.status === 'preparing' ? '#1d4ed8' : ord.status === 'served' ? '#4338ca' : '#15803d',
                      cursor: ord.status === 'completed' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="placed">PLACED</option>
                    <option value="preparing">PREPARING</option>
                    <option value="served">SERVED</option>
                    <option value="completed">🔒 COMPLETED</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  {ord.items.map((i, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span><strong>{i.quantity}x</strong> {i.menuItem.name}</span>
                      <span>{currentRestaurant.currency}{i.menuItem.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', fontWeight: '800' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: 'var(--primary)' }}>{currentRestaurant.currency}{ord.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: QR Standee Generator */}
      {activeTab === 'qr' && <QRStandeeGenerator />}

      {/* Add Item Modal */}
      {showAddModal && (
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
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Add New Dish to Menu</h3>
            <form onSubmit={handleCreateItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Dish Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malai Chaap Tikka Tandoori"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Price ({currentRestaurant.currency}):</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Category:</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                  >
                    {uniqueCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Description:</label>
                <textarea
                  rows={2}
                  placeholder="Short appetizing description of ingredients..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Tags (comma separated):</label>
                <input
                  type="text"
                  placeholder="Chaap, Tandoor, Chef Special"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                  />
                  Vegetarian Dish
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dish Modal */}
      {editingDish && (
        <EditDishModal
          dish={editingDish}
          categories={uniqueCategories}
          onClose={() => setEditingDish(null)}
          onSave={(updated) => {
            updateMenuItem(updated);
            setEditingDish(null);
          }}
        />
      )}
    </div>
  );
};

const EditDishModal: React.FC<{
  dish: MenuItem;
  categories: any[];
  onClose: () => void;
  onSave: (updated: MenuItem) => void;
}> = ({ dish, categories, onClose, onSave }) => {
  const [name, setName] = useState(dish.name);
  const [price, setPrice] = useState(dish.price.toString());
  const [description, setDescription] = useState(dish.description);
  const [image, setImage] = useState(dish.image);
  const [categoryId, setCategoryId] = useState(dish.categoryId);
  const [tagsInput, setTagsInput] = useState(dish.tags.join(', '));
  const [isVeg, setIsVeg] = useState(dish.isVeg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...dish,
      name,
      price: Number(price),
      description,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      categoryId,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      isVeg
    });
  };

  return (
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
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>Edit Dish Item</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Dish Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Price (₹):</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Category:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Description:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Image URL:</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Tags (comma separated):</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
              />
              Vegetarian Dish
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
