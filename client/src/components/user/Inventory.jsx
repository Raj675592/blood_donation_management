import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import "../../css/Inventory.css";
import Footer from "../../pages/Footer";
import { useNavigate } from 'react-router-dom';

// Helper functions for stock status
const getStockStatus = (units) => {
  if (units <= 5) return "critical";
  if (units <= 15) return "low";
  return "good";
};

const getStockLabel = (units) => {
  if (units <= 5) return "Critical";
  if (units <= 15) return "Low Stock";
  return "In Stock";
};

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const REACT_APP_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8001";

  const getInventory = async () => {
    setError("");

    try {
      setLoading(true);
      const response = await fetch(
        `${REACT_APP_URL}/api/users/inventory-overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setInventory(data.bloodInventory || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch inventory overview:", error);
      setError("Failed to fetch inventory overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="inventory-navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🩸</span>
          <span className="brand-text">Blood Bank</span>
        </div>
        <div className="navbar-links">
          <button 
            className="nav-btn nav-btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </button>
          <button 
            className="nav-btn nav-btn-secondary"
            onClick={() => navigate('/blood-request')}
          >
            <span className="nav-icon">💉</span>
            Request Blood
          </button>
         
          <button 
            className="nav-btn nav-btn-refresh"
            onClick={getInventory}
            disabled={loading}
          >
            <span className="nav-icon">{loading ? '⏳' : '🔄'}</span>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </nav>

      <div className="inventory-container">
        <div className="inventory-header">
          <h2>Inventory Overview</h2>
          <p className="inventory-subtitle">View available blood units across all blood types</p>
        </div>
        {loading ? (
          <p>Loading inventory data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="inventory-data">
            {/* Render inventory data here */}
            <div className="inventory-grid">
              {inventory.map((item) => (
                <div key={item._id} className="inventory-card">
                  <div className="card-header">
                    <h4 className="blood-type-title">{item.bloodType}</h4>
                    <span
                      className={`stock-status ${getStockStatus(
                        item.unitsAvailable
                      )}`}
                    >
                      {getStockLabel(item.unitsAvailable)}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="units-display">
                      <span className="units-number">
                        {item.unitsAvailable}
                      </span>
                      <span className="units-label">Units</span>
                    </div>

                    <div className="item-details">
                      {item.expiryDate && (
                        <div className="detail-item">
                          <strong>Expires:</strong>{" "}
                          <span>{new Date(item.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="detail-item">
                          <strong>Location:</strong> <span>{item.location}</span>
                        </div>
                      )}
                      {item.lastUpdated && (
                        <div className="detail-item">
                          <strong>Updated:</strong>{" "}
                          <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      )}
                      <button
                        onClick={() => navigate('/blood-request')}
                        className="btn btn-sm btn-danger"
                        style={{ marginTop: "10px", backgroundColor: "green" }}>
                        Request Blood
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {inventory.length === 0 && !loading && (
          <div className="empty-state">
            <p>No available inventory items found. </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Inventory;
