import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import PageState from "../components/PageState";
import MovieCard from "../components/MovieCard";
import { getWatchlist, removeFromWatchlist } from "../services/userService";
import useIsMobile from "../hooks/useIsMobile";

function Watchlist() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
    staleTime: 1000 * 60 * 2,
  });

  const list = data?.data ?? [];

  const { mutate: remove } = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const gridCols = isMobile ? 3 : isTablet ? 4 : 5;

  return (
    <div className="bg-[#14181c] min-h-screen text-white">
      <Navbar />
      <div className="max-w-275 mx-auto px-4 sm:px-6 pt-28 pb-20">
        <BackButton className="mb-4" />
        <header className="flex justify-between items-baseline border-b border-[#2c3440] pb-2.5 mb-8">
          <h1 className="text-[1.4rem] uppercase tracking-[1px] font-semibold">
            Watchlist
          </h1>
          <span className="text-[#667788] text-sm font-bold">
            {list.length} Films
          </span>
        </header>

        <PageState
          loading={isLoading}
          error={error ? "Failed to load watchlist." : null}
          onRetry={refetch}
        />

        {!isLoading && !error && list.length === 0 && (
          <div className="text-center py-24 text-[#667788]">
            <p className="mb-4 text-sm">
              Your watchlist is empty. Start adding some movies!
            </p>
            <Link
              to="/"
              className="text-[#00e054] border border-[#00e054] px-4 py-2 rounded text-sm hover:bg-[#00e054]/10 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}

        {!isLoading && !error && list.length > 0 && (
          <div
            className="grid gap-5 sm:gap-6"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {list.map((movie) => (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(movie.movieId);
                  }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 text-white text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#ff4b4b] transition-all cursor-pointer"
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

export default Watchlist;
