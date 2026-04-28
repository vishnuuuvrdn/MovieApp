import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import PageState from "../components/PageState";
import MovieCard from "../components/MovieCard";
import { getMovieById, getSimilarMovies } from "../services/movieService";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaEye, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import api from "../services/api";
import useToast from "../hooks/useToast";

const iconBtn = (active, activeColor) =>
  `bg-[#242c35] border rounded-[4px] px-4 py-2.5 cursor-pointer flex items-center text-xl transition-all hover:bg-[#2c3440] hover:text-white ${active ? `${activeColor} border-current` : "border-[#2c3440] text-[#99aabb]"}`;

function MovieDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast, showToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const { data: movieData, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    staleTime: 1000 * 60 * 10,
  });

  const { data: similarData, isLoading: similarLoading } = useQuery({
    queryKey: ["similar", id],
    queryFn: () => getSimilarMovies(id),
    staleTime: 1000 * 60 * 10,
  });

  const movie = movieData?.data;
  const similarMovies = similarData?.data?.results || [];
  const loading = movieLoading || similarLoading;

  useEffect(() => {
    if (!token || !movie) return;
    const loadUserData = async () => {
      const [favRes, watchlistRes, watchedRes] = await Promise.all([
        getFavorites(),
        getWatchlist(),
        api.get(`/api/movies/watched/${id}`),
      ]);
      const cid = Number(id);
      setIsFavorite(favRes.data.some((m) => Number(m.movieId) === cid));
      setIsInWatchlist(
        !!watchlistRes.data.find((m) => Number(m.movieId) === cid),
      );
      setIsWatched(watchedRes.data.watched);
    };
    loadUserData();
    window.scrollTo(0, 0);
  }, [id, movie, token]);

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(movie.id);
        setIsFavorite(false);
        showToast("Removed from Favorites");
      } else {
        await addFavorite(movie.id, movie.title, movie.poster_path);
        setIsFavorite(true);
        showToast("Added to Favorites");
      }
    } catch {
      showToast("Error updating favorites");
    }
  };

  const handleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie.id);
        setIsInWatchlist(false);
        setIsWatched(false);
        showToast("Removed from Watchlist");
      } else {
        await addToWatchlist({
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        });
        setIsInWatchlist(true);
        showToast("Added to Watchlist");
      }
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    } catch {
      showToast("Error updating watchlist");
    }
  };

  const toggleWatched = async () => {
    try {
      if(!isWatched){
        await api.post(`/api/movies/watched/${movie.id}`, {
          title: movie.title,
          poster: movie.poster_path,
        });
      }else{
        await api.delete(`/api/movies/watched/${movie.id}`);
      }
      setIsWatched((p) => !p);
      showToast(!isWatched ? "Marked as Watched" : "Removed from Watched");
    } catch {
      showToast("Error updating status");
    }
  };

  return (
    <div className="bg-[#14181c] min-h-screen">
      <Navbar />
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#242c35] text-white px-6 py-3 rounded-sm border border-[#445566] font-semibold z-50 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          {toast}
        </div>
      )}
      <div className="max-w-262.5 mx-auto px-4 sm:px-6 pt-20 pb-20">
        <PageState
          loading={loading}
          error={!movie && !loading ? "Failed to load movie." : null}
        />
        {!loading && movie && (
          <>
            <BackButton className="mb-6" />
            <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-8 items-start">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
                className="w-40 md:w-full mx-auto md:mx-0 rounded-sm border border-[#2c3440]"
              />
              <div className="w-full">
                <h1 className="font-['Bebas_Neue'] text-4xl sm:text-5xl text-white leading-none uppercase">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="italic text-[#667788] text-base mt-2">
                    "{movie.tagline}"
                  </p>
                )}
                <p className="text-[#99aabb] text-sm sm:text-base leading-relaxed my-5">
                  {movie.overview}
                </p>
                {token && (
                  <div className="flex gap-3 mb-6 flex-wrap">
                    <button
                      onClick={handleFavorite}
                      className={iconBtn(isFavorite, "text-[#ff8000]")}
                      title={
                        isFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                    >
                      {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
                    </button>
                    <button
                      onClick={handleWatchlist}
                      className={iconBtn(isInWatchlist, "text-[#00e054]")}
                      title={
                        isInWatchlist
                          ? "Remove from Watchlist"
                          : "Add to Watchlist"
                      }
                    >
                      {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                    <button
                      onClick={toggleWatched}
                      className={iconBtn(isWatched, "text-[#00e054]")}
                      title={
                        isWatched ? "Mark as Unwatched" : "Mark as Watched"
                      }
                    >
                      {isWatched ? <FaEye /> : <LuEyeClosed />}
                    </button>
                  </div>
                )}
                <div className="flex gap-10 border-t border-[#2c3440] pt-5">
                  {[
                    ["Rating", `⭐ ${movie.vote_average?.toFixed(1)}`],
                    ["Released", movie.release_date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="block text-[0.65rem] text-[#667788] uppercase mb-1">
                        {label}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {similarMovies.length > 0 && (
              <div className="mt-14">
                <h2 className="text-[#99aabb] uppercase text-xs tracking-[2px] font-semibold mb-5">
                  Similar Movies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
                  {similarMovies.map((m) => (
                    <MovieCard
                      key={m.id}
                      movie={m}
                      onClick={() => navigate(`/movie/${m.id}`)}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
