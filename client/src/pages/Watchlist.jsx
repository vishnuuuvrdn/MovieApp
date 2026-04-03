import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Watchlist.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Watchlist() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const token = localStorage.getItem("token");

  const fetchWatchlist = async () => {
    const res = await axios.get(`${BASE_URL}/api/movies/watchlist`, { headers: { Authorization: token} });
    setList(res.data);
  };

  const removeMovie = async (e, id) => {
    e.stopPropagation();
    await axios.delete(`${BASE_URL}/api/movies/watchlist/${id}`, {
      headers: { Authorization: token },
    });
    fetchWatchlist();
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="wl-page">
      <Navbar />
      <div className="wl-container">
        <div className="wl-top-navigation">
          <button className="wl-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <header className="wl-header">
          <h1 className="wl-page-title">Watchlist</h1>
          <span className="wl-count">{list.length} Films</span>
        </header>

        {list.length === 0 ? (
          <div className="wl-empty-state">
            <p>Your watchlist is empty. Start adding some movies!</p>
            <Link to="/" className="wl-browse-link">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="wl-grid">
            {list.map((movie) => (
              <div key={movie.movieId} className="fv-card-wrapper">
                <div
                  className="wl-poster-wrapper"
                  onClick={() => navigate(`/movie/${movie.movieId}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    alt={movie.title}
                  />
                  <button
                    className="wl-remove-btn"
                    onClick={(e) => removeMovie(e, movie.movieId)}
                  >
                    ×
                  </button>
                </div>
                <h3 className="wl-title">{movie.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
