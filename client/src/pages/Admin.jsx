import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/stats", {
        headers: { Authorization: token },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
        headers: { Authorization: token },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.users || 0}</span>
          <span className="stat-label">Users</span>
        </div>
        <div className="stat-card" style={{ borderColor: "var(--lb-orange)" }}>
          <span className="stat-value">{stats.favorites || 0}</span>
          <span className="stat-label">Favorites</span>
        </div>
        <div className="stat-card" style={{ borderColor: "var(--lb-green)" }}>
          <span className="stat-value">{stats.watched || 0}</span>
          <span className="stat-label">Watched</span>
        </div>
        <div className="stat-card" style={{ borderColor: "#be33ff" }}>
          <span className="stat-value">{stats.watchlist || 0}</span>
          <span className="stat-label">WatchList</span>
        </div>
      </section>

      <h2 className="user-list-header">User Management</h2>

      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <p>
                  <strong>{user.name}</strong>
                  <span className="role-badge">{user.role}</span>
                </p>
                <p>{user.email}</p>
              </div>
              <button
                className="btn-delete"
                onClick={() => deleteUser(user._id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p
            style={{
              color: "var(--lb-text-main)",
              textAlign: "center",
              padding: "20px",
            }}
          >
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Admin;
