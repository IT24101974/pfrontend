import { deleteItem } from "../api/itemApi";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  "In Stock": "badge-green",
  "Low Stock": "badge-yellow",
  "Out of Stock": "badge-red",
};

const CATEGORY_ICONS = {
  Electronics: "💻",
  Clothing: "👕",
  Food: "🍔",
  Books: "📚",
  Sports: "⚽",
  Other: "📦",
};

export default function ItemCard({ item, onEdit, onRefresh }) {
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await deleteItem(item._id);
      toast.success("Item deleted!");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="item-card">
      <div className="item-card-header">
        <span className="item-category-icon">{CATEGORY_ICONS[item.category] || "📦"}</span>
        <div className="item-meta">
          <span className="item-category-label">{item.category}</span>
          <span className={`badge ${STATUS_COLORS[item.status]}`}>{item.status}</span>
        </div>
      </div>

      <h3 className="item-name">{item.name}</h3>
      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      <div className="item-stats">
        <div className="stat">
          <span className="stat-label">Price</span>
          <span className="stat-value">LKR {Number(item.price).toLocaleString()}</span>
        </div>

        <div className="stat">
          <span className="stat-label">Supplier</span>
          <span className="stat-value">{item.Supplier}</span>
        </div>

        <div className="stat">
          <span className="stat-label">Discount</span>
          <span className="stat-value">{item.discount}%</span>
        </div>

        <div className="stat">
          <span className="stat-label">Qty</span>
          <span className="stat-value">{item.quantity}</span>
        </div>

      </div>

      <div className="item-card-footer">
        <button className="btn-edit" onClick={() => onEdit(item)}>
          ✏️ Edit
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
