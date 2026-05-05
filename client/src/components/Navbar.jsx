import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Watchlist", path: "/watchlist", auth: true },
  { label: "Favorites", path: "/favorites", auth: true },
  { label: "Profile", path: "/profile", auth: true },
  { label: "Login", path: "/login", auth: false },
  { label: "Register", path: "/register", auth: false },
];

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const isFirstRender = useRef(true);
  const isMobile = useIsMobile();
  const { token, logout } = useAuth();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const delay = setTimeout(() => {
      if (window.location.pathname !== "/") navigate(`/?search=${query}`);
      else if (onSearch) onSearch(query);
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const links = NAV_LINKS.filter((l) => l.auth === !!token);

  const btnClass = (mobile) =>
    mobile
      ? "text-[#99aabb] uppercase font-semibold text-[0.7rem] px-3 py-2 rounded-lg hover:text-white hover:bg-[#242c35] transition-all text-left w-full"
      : "text-[#99aabb] uppercase font-semibold text-[0.65rem] px-2 py-1 rounded-full hover:text-white hover:bg-[#242c35] transition-all whitespace-nowrap cursor-pointer";

  const renderLinks = (mobile) => (
    <>
      {links.map(({ label, path }) => (
        <button
          key={label}
          onClick={() => {
            navigate(path);
            if (mobile) setMenuOpen(false);
          }}
          className={btnClass(mobile)}
        >
          {label}
        </button>
      ))}
      {token && (
        <>
          {mobile && <div className="h-px bg-[#2c3440] my-1" />}
          <button
            onClick={handleLogout}
            className={
              mobile
                ? "text-[#e05050] uppercase font-semibold text-[0.7rem] px-3 py-2 rounded-lg hover:bg-[#e05050]/10 transition-all text-left w-full"
                : "text-[#e05050] uppercase font-semibold text-[0.65rem] px-2 py-1 rounded-full hover:bg-[#e05050]/20 transition-all whitespace-nowrap cursor-pointer"
            }
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <div className="fixed top-3 left-0 right-0 flex flex-col items-center z-50 px-4">
      <nav
        className={`bg-[#1b2228] border border-[#2c3440] rounded-full px-6 py-2 flex items-center gap-4 shadow-md shadow-black/30 w-full transition-all duration-300 ${searchFocused ? "max-w-170" : "max-w-145"}`}
      >
        {!isMobile && (
          <>
            <h1
              onClick={() => navigate("/")}
              className="text-white text-base cursor-pointer tracking-[2px] font-sans font-bold shrink-0 pr-4 border-r border-[#2c3440]"
            >
              Cineboxd
            </h1>
            <input
              type="text"
              placeholder="Search films..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-[#242c35] border border-[#2c3440] rounded-full px-3 py-1.25 text-white text-xs outline-none transition-all duration-300 placeholder:text-[#556] focus:border-[#00e054] w-35 focus:w-55"
            />
            <div className="flex items-center gap-0.5 ml-auto">
              <div className="w-px h-3.5 bg-[#2c3440] mr-1" />
              {renderLinks(false)}
            </div>
          </>
        )}
        {isMobile && (
          <>
            <h1
              onClick={() => navigate("/")}
              className="text-white text-base cursor-pointer tracking-[2px] font-sans font-bold shrink-0 pr-2 border-r border-[#2c3440]"
            >
              Cineboxd
            </h1>
            <div className="flex items-center gap-0 ml-0.5">
              <input
                type="text"
                placeholder="Search films..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-[#242c35] border border-[#2c3440] rounded-full px-3 py-1.25 text-white text-xs outline-none transition-all duration-300 placeholder:text-[#556] focus:border-[#00e054] w-25 focus:w-32 ml-0 mr-8 focus:mr-1"
              />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col gap-1 cursor-pointer p-1"
              >
                <span className="block w-4 h-[1.5px] bg-[#99aabb] rounded" />
                <span
                  className={`block h-[1.5px] bg-[#99aabb] rounded transition-all duration-300 ${menuOpen ? "w-4" : "w-2.75"}`}
                />
                <span className="block w-4 h-[1.5px] bg-[#99aabb] rounded" />
              </button>
            </div>
          </>
        )}
      </nav>
      {isMobile && menuOpen && (
        <div className="mt-2 bg-[#1b2228] border border-[#2c3440] rounded-2xl p-3 w-full max-w-145 flex flex-col shadow-md shadow-black/30">
          {renderLinks(true)}
        </div>
      )}
    </div>
  );
}

export default Navbar;
