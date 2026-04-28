import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import PageState from "../components/PageState";
import MovieCard from "../components/MovieCard";
import { getFavorites, removeFavorite } from "../services/userService";

function Favorites() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 2,
  });

  const favorites = data?.data ?? [];

  const { mutate: remove } = useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["favorites"], (old) => ({
        ...old,
        data: old.data.filter((m) => m.movieId !== id),
      }));
    },
  });

  const handleRemove = (e, id) => {
    e.stopPropagation();
    remove(id);
  };

  return (
    <div className="bg-[#14181c] min-h-screen text-white">
      <Navbar />
      <div className="max-w-275 mx-auto px-4 sm:px-6 pt-28 pb-20">
        <BackButton className="mb-4" />
        <header className="flex justify-between items-baseline border-b border-[#2c3440] pb-3 mb-8">
          <h1 className="text-xl uppercase tracking-[1px] font-bold">
            Favorites
          </h1>
          <span className="text-[#667788] text-xs font-bold">
            {favorites.length} FILMS
          </span>
        </header>

        <PageState
          loading={isLoading}
          error={error ? "Failed to load favorites." : null}
          onRetry={refetch}
        />

        {!isLoading && !error && favorites.length === 0 && (
          <div className="text-center py-24 text-[#667788]">
            <p className="mb-4 text-sm">
              Your list is empty. Start adding some movies!
            </p>
            <Link
              to="/"
              className="text-[#00e054] border border-[#00e054] px-4 py-2 rounded-sm text-sm hover:brightness-125 transition-all"
            >
              Browse Movies
            </Link>
          </div>
        )}

        {!isLoading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
            {favorites.map((movie) => (
              <div key={movie.movieId} className="relative group">
                <MovieCard
                  movie={{
                    id: movie.movieId,
                    poster_path: movie.poster,
                    title: movie.title,
                  }}
                  onClick={() => navigate(`/movie/${movie.movieId}`)}
                />
                <button
                  onClick={(e) => handleRemove(e, movie.movieId)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 text-white text-lg leading-none opacity-0 group-hover:opacity-100 hover:bg-[#ff4b4b] transition-all cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
