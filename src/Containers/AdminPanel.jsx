import React, { useEffect, useState } from "react";
import { api } from "../api";
import { sampleProducts } from "../data/sampleProducts";

const defaultFormState = {
  title: "",
  category: "",
  price: "",
  stock: "",
  status: "",
  description: "",
  image: "",
  specs: "",
};

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      setProducts(sampleProducts);
      setMessage(
        "Unable to reach the API. Showing sample inventory data instead."
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId("");
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormState({
      title: product.title,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
      image: product.image,
      specs: (product.specs || []).join(", "),
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setMessage("Sensor removed from inventory.");
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage("Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...formState,
      price: Number(formState.price),
      stock: Number(formState.stock),
      specs: formState.specs
        ? formState.specs.split(",").map((item) => item.trim())
        : [],
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Inventory updated.");
      } else {
        await api.post("/products", payload);
        setMessage("New sensor added.");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage("Save failed. Confirm required fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page admin">
      <section className="admin__hero">
        <div>
          <p className="section-label">Admin Panel</p>
          <h1>Inventory management</h1>
          <p>
            Add new sensors, adjust stock levels, and track ready-to-ship
            inventory in one place.
          </p>
        </div>
        <div className="admin__status">
          <div>
            <h3>{products.length}</h3>
            <p>Active SKUs</p>
          </div>
          <div>
            <h3>
              {products.reduce((total, product) => total + product.stock, 0)}
            </h3>
            <p>Total units</p>
          </div>
        </div>
      </section>

      <section className="admin__grid">
        <form className="admin__form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Sensor" : "Add New Sensor"}</h2>
          <label>
            Sensor Name
            <input
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="ThermoSense Pro"
              required
            />
          </label>
          <label>
            Category
            <input
              name="category"
              value={formState.category}
              onChange={handleChange}
              placeholder="Temperature"
              required
            />
          </label>
          <div className="admin__split">
            <label>
              Price ($)
              <input
                name="price"
                type="number"
                value={formState.price}
                onChange={handleChange}
                placeholder="129"
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                value={formState.stock}
                onChange={handleChange}
                placeholder="24"
              />
            </label>
          </div>
          <label>
            Status
            <input
              name="status"
              value={formState.status}
              onChange={handleChange}
              placeholder="In Stock"
            />
          </label>
          <label>
            Image URL
            <input
              name="image"
              value={formState.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
          <label>
            Specs (comma separated)
            <input
              name="specs"
              value={formState.specs}
              onChange={handleChange}
              placeholder="±0.2°C accuracy, IP67 housing"
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Short description for buyers."
              rows="4"
            />
          </label>
          <div className="admin__actions">
            <button className="primary-button" type="submit" disabled={loading}>
              {editingId ? "Save Changes" : "Add Sensor"}
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
          {message && <p className="form-message">{message}</p>}
        </form>

        <div className="admin__table">
          <h2>Inventory Overview</h2>
          <div className="table">
            <div className="table__head">
              <span>Sensor</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {products.map((product) => (
              <div className="table__row" key={product.id}>
                <span>
                  <strong>{product.title}</strong>
                  <small>{product.id}</small>
                </span>
                <span>{product.category}</span>
                <span>$ {product.price}</span>
                <span>{product.stock}</span>
                <span>{product.status}</span>
                <span className="table__actions">
                  <button
                    className="link-button"
                    type="button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="link-button danger"
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminPanel;
