import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token || !user) return null;

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name },
        { headers: { Authorization: token } },
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="arrow">‹</span> BACK
        </button>
      </nav>

      <div className="profile-card">
        <header className="profile-header">
          <div className="avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="header-text">
            <h1 className="profile-title">{user.name}</h1>
            <span className="profile-badge">{user.role}</span>
          </div>
        </header>

        <section className="profile-details">
          <div className="detail-item">
            <label>User ID</label>
            <p>{user.id}</p>
          </div>

          <div className="edit-section">
            <label>Display Name</label>
            <input
              className="letterboxd-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn-update" onClick={handleUpdate}>
              SAVE CHANGES
            </button>
          </div>
        </section>

        <footer className="profile-footer">
          {user.role === "admin" && (
            <button className="btn-admin" onClick={() => navigate("/admin")}>
              ADMIN PANEL
            </button>
          )}
          <button
            className="btn-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            LOGOUT
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Profile;
