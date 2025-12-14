import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

// 🔐 Extract role safely from JWT
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { token, role: payload.role };
  } catch {
    return null;
  }
};

// 🖼 Image mapper (from public/sweets)
const sweetImages = {
  "gulab jamun": "/sweets/gulab_jamun.png",
  barfi: "/sweets/barfi.jpg",
  "kaju katli": "/sweets/kaju_katli.jpg",
  peda: "/sweets/peda.jpg",
};

function Dashboard() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const token = user?.token;
  const isAdmin = user?.role === "ADMIN";

  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");

  // Admin form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // 🔐 Protect dashboard + load sweets
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadSweets = async () => {
      try {
        const res = await api.get("/sweets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSweets(res.data);
      } catch {
        alert("Failed to load sweets");
      }
    };

    loadSweets();
  }, [token, navigate]);

  // 🛒 Purchase
  const purchaseSweet = async (id) => {
    try {
      await api.post(
        `/sweets/${id}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSweets((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, quantity: s.quantity - 1 } : s
        )
      );
    } catch {
      alert("Purchase failed");
    }
  };

  // ➕ Add Sweet (ADMIN)
  const addSweet = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/sweets",
        { name, category, price: Number(price), quantity: Number(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSweets((prev) => [...prev, res.data.sweet]);
      setName("");
      setCategory("");
      setPrice("");
      setQuantity("");
    } catch {
      alert("Add sweet failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredSweets = sweets.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Sweet Shop Dashboard 🍬</h2>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>

      <input
        className="search-input"
        placeholder="Search sweets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADMIN FORM */}
      {isAdmin && (
        <form className="admin-form" onSubmit={addSweet}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <button className="primary">Add Sweet</button>
        </form>
      )}

      {/* 🧁 Cards */}
      <div className="sweets-grid">
        {filteredSweets.map((sweet) => (
          <div className="sweet-card" key={sweet._id}>
            <img
              className="sweet-img"
              src={sweetImages[sweet.name.toLowerCase()] || "/sweets/barfi.jpg"}
              alt={sweet.name}
            />

            <div className="sweet-content">
              <div className="sweet-title">{sweet.name}</div>
              <div className="sweet-category">{sweet.category}</div>
              <div className="sweet-price">₹ {sweet.price}</div>
              <div className="sweet-qty">Stock: {sweet.quantity}</div>

              <button
                className="success"
                disabled={sweet.quantity === 0}
                onClick={() => purchaseSweet(sweet._id)}
              >
                {sweet.quantity === 0 ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
