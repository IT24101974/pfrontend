import { useState } from "react";
import { createItem, updateItem } from "../api/itemApi";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics", "Clothing", "Food", "Books", "Sports", "Other"];
const STATUSES = ["In Stock", "Low Stock", "Out of Stock"];

const defaultForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "Other",
  status: "In Stock",
  supplier: "unknown",
  discount: 0
};

export default function ItemForm({ editItem, onSuccess, onCancel }) {
  const [form, setForm] = useState(editItem || defaultForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editItem) {
        await updateItem(editItem._id, form);
        toast.success("Item updated successfully! ✅");
      } else {
        await createItem(form);
        toast.success("Item created successfully! 🎉");
      }
      setForm(defaultForm);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {editItem ? "✏️ Edit Item" : "➕ Add New Item"}
        </h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Mouse"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description of the item..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (LKR) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Supplier *</label>
              <input
              type="String"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              placeholder="supplier name"
              required
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving..." : editItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
