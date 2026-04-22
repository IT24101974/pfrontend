import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { fetchItems } from "./api/itemApi";
import ItemCard from "./components/ItemCard";
import ItemForm from "./components/ItemForm";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchItems();
      setItems(res.data);
    } catch (err) {
      setError("Failed to load items. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    loadItems();
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || item.category === filterCategory;
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalValue = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const inStock = items.filter((i) => i.status === "In Stock").length;
  const lowStock = items.filter((i) => i.status === "Low Stock").length;
  const outOfStock = items.filter((i) => i.status === "Out of Stock").length;

  return (
    <div className="app">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📦</span>
            <div>
              <h1>Item Manager</h1>
              <p className="logo-sub">MERN Stack Inventory System</p>
            </div>
          </div>
          <button className="btn-add" onClick={() => setShowForm(true)}>
            + Add Item
          </button>
        </div>
      </header>

      <main className="main">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-num">{items.length}</span>
            <span className="stat-lbl">Total Items</span>
          </div>
          <div className="stat-card green">
            <span className="stat-num">{inStock}</span>
            <span className="stat-lbl">In Stock</span>
          </div>
          <div className="stat-card yellow">
            <span className="stat-num">{lowStock}</span>
            <span className="stat-lbl">Low Stock</span>
          </div>
          <div className="stat-card red">
            <span className="stat-num">{outOfStock}</span>
            <span className="stat-lbl">Out of Stock</span>
          </div>
          <div className="stat-card blue">
            <span className="stat-num">LKR {totalValue.toLocaleString()}</span>
            <span className="stat-lbl">Total Value</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            className="search-input"
            placeholder="🔍 Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {["Electronics", "Clothing", "Food", "Books", "Sports", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {["In Stock", "Low Stock", "Out of Stock"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="center-msg">
            <div className="spinner" />
            <p>Loading items...</p>
          </div>
        ) : error ? (
          <div className="center-msg error-msg">
            <span>⚠️</span>
            <p>{error}</p>
            <button className="btn-retry" onClick={loadItems}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="center-msg">
            <span style={{ fontSize: "3rem" }}>🗂️</span>
            <p>{items.length === 0 ? "No items yet. Add your first item!" : "No results match your search."}</p>
          </div>
        ) : (
          <div className="items-grid">
            {filtered.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onEdit={handleEdit}
                onRefresh={loadItems}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <ItemForm
          editItem={editItem}
          onSuccess={handleSuccess}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
