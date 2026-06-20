import { useState, useEffect } from "react";
// import { useToast } from "../../contexts/ToastContext";
import "../../css/Inventory.css";
import Footer from "../../pages/Footer";
import { useNavigate } from "react-router-dom";

// ─── Helper functions (unchanged) ───────────────────────────────────────────
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

// ─── Component ───────────────────────────────────────────────────────────────
function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  // const { showToast } = useToast();
  const navigate = useNavigate();

  const REACT_APP_URL = process.env.REACT_APP_API_URL || "http://localhost:8001";

  // ── Data fetch (unchanged) ──────────────────────────────────────────────
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

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalUnits   = inventory.reduce((s, i) => s + (i.unitsAvailable || 0), 0);
  const criticalCount = inventory.filter(i => getStockStatus(i.unitsAvailable) === "critical").length;
  const typesInStock  = inventory.filter(i => getStockStatus(i.unitsAvailable) !== "critical").length;

  return (
    <div className="inv-root">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="inv-nav">
        <div className="inv-nav__brand">
          <span className="inv-nav__drop">🩸</span>
          <span className="inv-nav__title">BloodBank</span>
        </div>

        <div className="inv-nav__actions">
          <button
            className="inv-btn inv-btn--ghost"
            onClick={() => navigate("/dashboard")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </button>

          <button
            className="inv-btn inv-btn--outline"
            onClick={() => navigate("/blood-request")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Request Blood
          </button>

          <button
            className="inv-btn inv-btn--accent"
            onClick={getInventory}
            disabled={loading}
          >
            <svg
              className={loading ? "inv-spin" : ""}
              xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
            </svg>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <header className="inv-hero">
        <span className="inv-hero__eyebrow">Live Stock Dashboard</span>
        <h1 className="inv-hero__title">Blood Inventory</h1>
        <p className="inv-hero__sub">
          Real-time availability across all blood types
        </p>

        {/* Summary stats — only when data is loaded */}
        {!loading && !error && inventory.length > 0 && (
          <div className="inv-stats">
            <div className="inv-stat">
              <span className="inv-stat__num">{totalUnits}</span>
              <span className="inv-stat__label">Total Units</span>
            </div>
            <div className="inv-stat__divider" />
            <div className="inv-stat">
              <span className="inv-stat__num inv-stat__num--teal">{typesInStock}</span>
              <span className="inv-stat__label">Types Available</span>
            </div>
            <div className="inv-stat__divider" />
            <div className="inv-stat">
              <span className="inv-stat__num inv-stat__num--red">{criticalCount}</span>
              <span className="inv-stat__label">Critical Alerts</span>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="inv-main">

        {/* Loading */}
        {loading && (
          <div className="inv-feedback">
            <div className="inv-spinner" />
            <p className="inv-feedback__text">Fetching inventory data…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="inv-feedback inv-feedback--error">
            <span className="inv-feedback__icon">⚠️</span>
            <p className="inv-feedback__text">{error}</p>
            <button className="inv-btn inv-btn--accent" onClick={getInventory}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && inventory.length === 0 && (
          <div className="inv-feedback">
            <span className="inv-feedback__icon" style={{ filter: "grayscale(1) opacity(0.4)" }}>🩸</span>
            <p className="inv-feedback__title">No inventory found</p>
            <p className="inv-feedback__text">
              Check back later or contact your administrator.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && inventory.length > 0 && (
          <div className="inv-grid">
            {inventory.map((item) => {
              const status = getStockStatus(item.unitsAvailable);
              return (
                <article key={item._id} className={`inv-card inv-card--${status}`}>

                  {/* Glow ring behind badge */}
                  <div className={`inv-card__ring inv-card__ring--${status}`} />

                  {/* Blood-type badge */}
                  <div className={`inv-card__badge inv-card__badge--${status}`}>
                    <span className="inv-card__type">{item.bloodType}</span>
                  </div>

                  {/* Units */}
                  <div className="inv-card__units">
                    <span className="inv-card__num">{item.unitsAvailable}</span>
                    <span className="inv-card__unit-label">Units Available</span>
                  </div>

                  {/* Status pill */}
                  <span className={`inv-card__pill inv-card__pill--${status}`}>
                    {getStockLabel(item.unitsAvailable)}
                  </span>

                  {/* Meta rows */}
                  {(item.expiryDate || item.location || item.lastUpdated) && (
                    <div className="inv-card__meta">
                      {item.expiryDate && (
                        <div className="inv-card__meta-row">
                          <span className="inv-card__meta-key">Expires</span>
                          <span className="inv-card__meta-val">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {item.location && (
                        <div className="inv-card__meta-row">
                          <span className="inv-card__meta-key">Location</span>
                          <span className="inv-card__meta-val">{item.location}</span>
                        </div>
                      )}
                      {item.lastUpdated && (
                        <div className="inv-card__meta-row">
                          <span className="inv-card__meta-key">Updated</span>
                          <span className="inv-card__meta-val">
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Request button */}
                  <button
                    className="inv-card__cta"
                    onClick={() => navigate("/blood-request")}
                  >
                    Request This Type
                  </button>

                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Inventory;