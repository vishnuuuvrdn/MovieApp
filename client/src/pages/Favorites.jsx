import { useEffect, useState } from "react";
import axios from "axios";
import "./Favorites.css";
import { useNavigate, Link } from "react-router-dom";
import Navbar from '../components/Navbar'

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/movies/favorites`,
        { headers: { Authorization: token } },
      );
      setFavorites(res.data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/movies/favorite/${id}`, {
        headers: { Authorization: token },
      });
      fetchFavorites();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="fv-page-bg">
      <nav>
        <Navbar />
      </nav>

      <div className="fv-main-container">
        <div className="fv-top-navigation">
          <button className="fv-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <header className="fv-header-section">
          <h1 className="fv-page-title">Favorites</h1>
          <span className="fv-film-count">{favorites.length} FILMS</span>
        </header>

        {favorites.length === 0 ? (
          <div className="fv-empty-state">
            <p>Your list is empty. Start adding some movies!</p>
            <Link to="/" className="fv-browse-link">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="fv-poster-grid">
            {favorites.map((movie) => (
              <div key={movie.movieId} className="fv-card-wrapper">
                <div
                  className="fv-poster-box"
                  onClick={() => navigate(`/movie/${movie.movieId}`)}
                >
                  <img
                    className="fv-poster-img"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                    alt={movie.title}
                  />
                  <button
                    className="fv-remove-overlay"
                    onClick={(e) => handleRemove(e, movie.movieId)}
                    title="Remove from favorites"
                  >
                    ×
                  </button>
                </div>
                <h3 className="fv-movie-name">{movie.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
