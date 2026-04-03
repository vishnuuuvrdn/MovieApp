import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import SimilarMovies from "./SimilarMovies";
import "./MovieDetails.css";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaEye, FaArrowLeft, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [toast, setToast] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        if (token) {
          const [movieRes, similarRes, favRes, watchRes, watchedRes] =
            await Promise.all([
              axios.get(`${BASE_URL}/api/movies/${id}`),
              axios.get(`${BASE_URL}/api/movies/${id}/similar`),
              axios.get(`${BASE_URL}/api/movies/favorites`, {
                headers: { Authorization: token },
              }),
              axios.get(`${BASE_URL}/api/movies/watchlist`, {
                headers: { Authorization: token },
              }),
              axios.get(`${BASE_URL}/api/movies/watched/${id}`, {
                headers: { Authorization: token },
              }),
            ]);

          setMovie(movieRes.data);
          setSimilarMovies(similarRes.data.results || []);

          const currentId = Number(id);
          setIsFavorite(
            favRes.data.some((m) => Number(m.movieId) === currentId),
          );

          const watchEntry = watchRes.data.find(
            (m) => Number(m.movieId) === currentId,
          );
          setIsInWatchlist(!!watchEntry);
          setIsWatched(watchedRes.data.watched);
        } else {
          const [movieRes, similarRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/movies/${id}`),
            axios.get(`${BASE_URL}/api/movies/${id}/similar`),
          ]);

          setMovie(movieRes.data);
          setSimilarMovies(similarRes.data.results || []);
        }
      } catch (err) {
        console.error("Error fetching movie data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`${BASE_URL}/api/movies/favorite/${movie.id}`, {
          headers: { Authorization: token },
        });
        setIsFavorite(false);
        showToast("Removed from Favorites");
      } else {
        await axios.post(
          `${BASE_URL}/api/movies/favorite`,
          { movieId: movie.id, title: movie.title, poster: movie.poster_path },
          { headers: { Authorization: token } },
        );
        setIsFavorite(true);
        showToast("Added to Favorites");
      }
    } catch (err) {
      console.error("Error updating favorites", err);
      showToast("Error updating favorites");
    }
  };

  const handleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await axios.delete(`${BASE_URL}/api/movies/watchlist/${movie.id}`, {
          headers: { Authorization: token },
        });
        setIsInWatchlist(false);
        setIsWatched(false);
        showToast("Removed from Watchlist");
      } else {
        await axios.post(
          `${BASE_URL}/api/movies/watchlist`,
          { movieId: movie.id, title: movie.title, poster: movie.poster_path },
          { headers: { Authorization: token } },
        );
        setIsInWatchlist(true);
        showToast("Added to Watchlist");
      }
    } catch (err) {
      console.error("Error updating watchlist", err);
      showToast("Error updating watchlist");
    }
  };

  const toggleWatchedStatus = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/movies/watched/${movie.id}`,
        { title: movie.title, poster: movie.poster_path },
        { headers: { Authorization: token } },
      );

      const nextState = !isWatched;
      setIsWatched(nextState);
      showToast(nextState ? "Marked as Watched" : "Removed from Watched");
    } catch (err) {
      console.error("Update failed", err);
      showToast("Error updating status");
    }
  };

  if (loading || !movie) return <div className="loader">Loading...</div>;

  return (
    <div className="md-page">
      <Navbar />

      {toast && <div className="toast-popup">{toast}</div>}

      <div className="md-container">
        <button className="md-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="md-main-content">
          <div className="md-poster-column">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="md-poster"
            />
          </div>

          <div className="md-info-column">
            <div className="md-header-block">
              <h1 className="md-title">{movie.title}</h1>
              {movie.tagline && <p className="md-tagline">"{movie.tagline}"</p>}
            </div>

            <p className="md-overview">{movie.overview}</p>

            <div className="md-action-row">
              <button
                className={`md-icon-btn ${isFavorite ? "is-fav" : ""}`}
                onClick={handleFavorite}
                title={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              >
                {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
              </button>

              <button
                className={`md-icon-btn ${isInWatchlist ? "is-watchlisted" : ""}`}
                onClick={handleWatchlist}
                title={
                  isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
                }
              >
                {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              <button
                className={`md-icon-btn ${isWatched ? "is-watched" : ""}`}
                onClick={toggleWatchedStatus}
                title={isWatched ? "Mark as Unwatched" : "Mark as Watched"}
              >
                {isWatched ? <FaEye /> : <LuEyeClosed />}
              </button>
            </div>

            <div className="md-stats">
              <div className="md-stat-box">
                <span className="md-label">Rating</span>
                <span className="md-value">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
              </div>
              <div className="md-stat-box">
                <span className="md-label">Released</span>
                <span className="md-value">{movie.release_date}</span>
              </div>
            </div>
          </div>
        </div>

        <SimilarMovies movies={similarMovies} navigate={navigate} />
      </div>
    </div>
  );
}

export default MovieDetails;
