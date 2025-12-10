import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ToastContainer } from 'react-toastify';

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    bloodType: '',
    unitsAvailable: '',
    expiryDate: '',
    location: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
  const fetchInventory = useCallback(async () => {
    setError('');
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setInventory(data.bloodInventory || []);
      } else {
        setError(data.message || 'Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Inventory fetch error:', error);
      setError(error.message || 'Failed to fetch inventory. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!formData.bloodType || !formData.unitsAvailable || !formData.expiryDate || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.unitsAvailable) < 0) {
      setError('Units available cannot be negative');
      return;
    }

    try {
      const url = editingItem 
        ? `${API_BASE_URL}/api/inventory/${editingItem._id}`
        : `${API_BASE_URL}/api/inventory`;

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        const message = editingItem ? 'Inventory item updated successfully' : 'Inventory item added successfully';
        
        showToast(message, 'success');
        setShowAddForm(false);
        setEditingItem(null);
        setFormData({ bloodType: '', unitsAvailable: '', expiryDate: '', location: '' });
        fetchInventory();
        <ToastContainer toast={"Inventory item added successfully"} />
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError(editingItem ? 'Failed to update inventory item' : 'Failed to add inventory item');
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      bloodType: item.bloodType,
      unitsAvailable: item.unitsAvailable.toString(),
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      location: item.location || ''
    });
    setShowAddForm(true);
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const message = 'Inventory item deleted successfully';
      
        showToast(message, 'success');
        fetchInventory();
      } else {
        setError(data.message);
        showToast(data.message, 'error');
      }
    } catch (error) {
      setError('Failed to delete inventory item');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ bloodType: '', unitsAvailable: '', expiryDate: '', location: '' });
  };

  const getStockStatus = (units) => {
    if (units === 0) return 'out-of-stock';
    if (units < 5) return 'critical';
    if (units < 10) return 'low';
    return 'normal';
  };

  const getStockLabel = (units) => {
    if (units === 0) return 'Out of Stock';
    if (units < 5) return 'Critical';
    if (units < 10) return 'Low Stock';
    return 'Normal';
  };

  return (
    <div className="management-section">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="section-header">
        <h3>Blood Inventory</h3>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="btn btn-primary"
        >
          Add Stock
        </button>
      </div>

      {showAddForm && (
        <div className="form-modal">
          <form onSubmit={handleSubmit} className="inventory-form">
            <h4>{editingItem ? 'Edit' : 'Add'} Inventory Item</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Units Available</label>
                <input
                  type="number"
                  name="unitsAvailable"
                  value={formData.unitsAvailable}
                  onChange={handleFormChange}
                  required
                  min="0"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleFormChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="Storage location"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update' : 'Add'} Item
              </button>
              <button type="button" onClick={cancelForm} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading inventory...</div>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item) => (
            <div key={item._id} className="inventory-card">
              <div className="card-header">
                <h4 className="blood-type-title">{item.bloodType}</h4>
                <span className={`stock-status ${getStockStatus(item.unitsAvailable)}`}>
                  {getStockLabel(item.unitsAvailable)}
                </span>
              </div>
              
              <div className="card-body">
                <div className="units-display">
                  <span className="units-number">{item.unitsAvailable}</span>
                  <span className="units-label">Units</span>
                </div>
                
                <div className="item-details">
                  {item.expiryDate && (
                    <div className="detail-item">
                      <strong>Expires:</strong> {new Date(item.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                  {item.location && (
                    <div className="detail-item">
                      <strong>Location:</strong> {item.location}
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Updated:</strong> {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button
                  onClick={() => handleEdit(item)}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {inventory.length === 0 && !loading && (
        <div className="empty-state">
          <p>No inventory items found. Add some blood stock to get started.</p>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;
