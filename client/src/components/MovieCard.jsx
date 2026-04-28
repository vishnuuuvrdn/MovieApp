function MovieCard({ movie, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group transition-transform duration-200 hover:-translate-y-1.5"
    >
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.png"
        }
        alt={movie.title}
        loading="lazy"
        className="w-full aspect-2/3 rounded-sm border border-white/10 block object-cover group-hover:border-[#00e054] transition-colors duration-200"
      />
      <h3 className="text-[#99aabb] text-[0.75rem] text-center mt-2 font-normal truncate group-hover:text-white transition-colors duration-200">
        {movie.title}
      </h3>
    </div>
  );
}

export default MovieCard;
