import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMovies = async (searchQuery = "") => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `https://cinescope-j0z6.onrender.com/api/movies/search?q=${searchQuery}`
        : "https://cinescope-j0z6.onrender.com/api/movies";
      const res = await axios.get(url);
      setMovies(res.data.results);
    } catch (err) {
      console.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="home-page">
      <Navbar onSearch={fetchMovies} />

      <div className="home-content">
        <header className="home-hero">
          <h1>
            <b>Discover what's worth watching</b>
          </h1>
        </header>

        {loading ? (
          <div className="loader">Loading films...</div>
        ) : (
          <div className="home-grid">
            {movies.map((movie) => (
              <div
                className="home-card"
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
