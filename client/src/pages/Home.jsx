import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import PageState from "../components/PageState";
import useIsMobile from "../hooks/useIsMobile";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { getMovies, searchMovies } from "../services/movieService";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const searchQuery = searchParams.get("search") || "";

<<<<<<< HEAD
  const fetchMovies = async (searchQuery = "") => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `${import.meta.env.VITE_API_URL}/api/movies/search?q=${searchQuery}`
        : `${import.meta.env.VITE_API_URL}/api/movies`;
      const res = await axios.get(url);
      setMovies(res.data.results);
    } catch (err) {
      console.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };
=======
>>>>>>> 2aee7ce (Updated to Tailwind and fixed few bugs!)

  useEffect(() => {
    if (searchParams.get("welcome") === "1") {
      showToast(`Welcome to Cineboxd, ${user?.name || ""}! 🎬`);
      setSearchParams({});
    }
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["movies", searchQuery],
    queryFn: () => (searchQuery ? searchMovies(searchQuery) : getMovies()),
    staleTime: 1000 * 60 * 5,
  });

  const movies = data?.data?.results ?? [];
  const gridCols = isMobile ? 2 : isTablet ? 4 : 5;
  const handleSearch = (q) => setSearchParams(q ? { search: q } : {});

  return (
    <div className="bg-[#14181c] min-h-screen pt-12">
      <Navbar onSearch={handleSearch} />

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#242c35] text-white px-6 py-3 rounded-sm border border-[#445566] font-semibold z-50 shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-sm">
          {toast}
        </div>
      )}

      <div className="max-w-287.5 mx-auto px-4 sm:px-6 py-5">
        <header className="text-center py-8 sm:py-10">
          <h1 className="text-[#99aabb] uppercase text-xs sm:text-sm tracking-[2px] font-semibold">
            Discover what's worth watching
          </h1>
        </header>

        <PageState
          loading={isLoading}
          error={error ? "Failed to load movies." : null}
          empty={!isLoading && !error && movies.length === 0}
          onRetry={refetch}
        />

        {!isLoading && !error && movies.length > 0 && (
          <div
            className="grid gap-4 sm:gap-6"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
