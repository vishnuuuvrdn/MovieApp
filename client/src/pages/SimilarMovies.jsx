import React from "react";
import './SimilarMovies.css'

function SimilarMovies({ movies, navigate }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="similar-section">
        <h2 className="section-title">Similar Films</h2>
        <p className="no-data">No similar movies found.</p>
      </div>
    );
  }

  return (
    <div className="similar-section">
      <h2 className="section-title">Similar Films</h2>
      <div className="movie-grid">
        {movies.map((item) => (
          <div
            className="movie-card"
            key={item.id}
            onClick={() => navigate(`/movie/${item.id}`)}
          >
            <div className="poster-wrapper">
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "/placeholder.png"
                }
                alt={item.title}
              />
            </div>
            <h3 className="movie-title-sm">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarMovies;
