import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./Navbar.css";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const isFirstRender = useRef(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delay = setTimeout(() => {
      if (window.location.pathname !== "/") {
        navigate(`/?search=${query}`);
      } else if (onSearch) {
        onSearch(query);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <nav className="main-navbar">
      <div className="nav-content">
        <div className="nav-left">
          <h1 className="nav-logo" onClick={() => navigate("/")}>
            CineScope
          </h1>
        </div>

        <div className="nav-middle">
          <input
            type="text"
            name="text"
            id="text"
            placeholder="Search films..."
            className="nav-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {!token ? (
          <div className="nav-right">
            <button className="nav-item-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="nav-item-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="nav-right">
            <button
              className="nav-item-btn"
              onClick={() => navigate("/watchlist")}
            >
              Watchlist
            </button>
            <button
              className="nav-item-btn"
              onClick={() => navigate(`/favorites`)}
            >
              Favorites
            </button>
            <button
              className="nav-item-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
            <button
              className="nav-item-btn"
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              Profile
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
