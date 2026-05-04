import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import PageState from "../components/PageState";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const STATS = [
  { key: "users", label: "Users", color: "#40bcf4" },
  { key: "favorites", label: "Favorites", color: "#ff8000" },
  { key: "watched", label: "Watched", color: "#00e054" },
  { key: "watchlist", label: "Watchlist", color: "#be33ff" },
];

function AdminPanel() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/api/auth/users"),
    staleTime: 1000 * 60,
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/api/auth/stats"),
    staleTime: 1000 * 60,
  });

  const users = usersData?.data ?? [];
  const stats = statsData?.data ?? {};

  const { mutate: deleteUser } = useMutation({
    mutationFn: (id) => api.delete(`/api/auth/users/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["admin-users"], (old) => ({
        ...old,
        data: old.data.filter((u) => u._id !== id),
      }));
      window.location.href = "/admin"
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Remove this user?")) return;
    deleteUser(id);
  };

  return (
    <div className="bg-[#14181c] min-h-screen">
      <Navbar />
      <div className="max-w-237.5 mx-auto px-4 sm:px-6 pt-28 pb-20">
        <BackButton className="mb-6" />
        <header className="border-b border-[#445566] pb-2 mb-8">
          <h1 className="text-white text-xl font-bold uppercase tracking-[1.2px]">
            Admin Panel
          </h1>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#445566] border border-[#445566] rounded-sm overflow-hidden mb-10">
          {STATS.map(({ key, label, color }) => (
            <div
              key={key}
              className="bg-[#2c3440] px-5 py-5 text-center flex flex-col gap-1"
              style={{ borderBottom: `4px solid ${color}` }}
            >
              <span className="text-4xl font-extrabold text-white">
                {stats[key] ?? 0}
              </span>
              <span className="text-[0.65rem] uppercase tracking-widest text-[#99aabb]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <h2 className="text-[#99aabb] text-xs uppercase tracking-widest border-b border-[#445566] pb-2 mb-4">
          User Management
        </h2>

        <PageState
          loading={usersLoading}
          error={usersError ? "Failed to load users." : null}
          onRetry={() => queryClient.invalidateQueries(["admin-users"])}
        />

        {!usersLoading && !usersError && (
          <div className="rounded-sm overflow-hidden border border-[#2c3440]">
            {users.length === 0 ? (
              <p className="text-[#99aabb] text-sm text-center py-8">
                No users found.
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center bg-[#1b2228] border-b border-[#242c34] px-4 py-4 hover:bg-[#242c34] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-base">
                        {user.name}
                      </span>
                      <span className="bg-[#445566] text-white text-[0.6rem] uppercase px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[#99aabb] text-sm mt-1">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-[#445566] text-[#cde] text-[0.65rem] font-bold uppercase px-3 py-1.5 rounded-[3px] cursor-pointer hover:bg-[#ee4444] hover:text-white transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
