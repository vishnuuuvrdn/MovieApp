import MovieCard from "./MovieCard";

function SimilarMovies({ movies, navigate }) {
  return (
    <div className="mt-14 pt-10 border-t border-[#2c3440]">
      <h2 className="text-[#667788] text-[0.8rem] uppercase tracking-[2px] mb-6">
        Similar Films
      </h2>

      {!movies || movies.length === 0 ? (
        <p className="text-[#556] text-sm">No similar movies found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {movies.map((item) => (
            <MovieCard
              key={item.id}
              movie={item}
              onClick={() => navigate(`/movie/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SimilarMovies;
