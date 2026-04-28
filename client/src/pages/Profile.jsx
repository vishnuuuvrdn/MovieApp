import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import { updateProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import useToast from "../hooks/useToast";

function Profile() {
  const navigate = useNavigate();
  const { token, user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  const handleUpdate = async () => {
    try {
<<<<<<< HEAD
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        { name },
        { headers: { Authorization: token } },
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
=======
      const res = await updateProfile({ name });
      setUser(res.data);
      showToast("Profile updated!");
    } catch {
      showToast("Update failed.");
>>>>>>> 2aee7ce (Updated to Tailwind and fixed few bugs!)
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!token || !user) return null;

  return (
    <div className="bg-[#14181c] min-h-screen">
      <Navbar />
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#242c35] text-white px-6 py-3 rounded-sm border border-[#445566] font-semibold z-50 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          {toast}
        </div>
      )}
      <div className="flex flex-col items-center px-4 pt-28 pb-20">
        <div className="w-full max-w-150 mb-3">
          <BackButton />
        </div>
        <div className="bg-[#1b2228] w-full max-w-150 rounded-lg border border-[#2c3440] overflow-hidden">
          <header className="p-8 flex items-center gap-5 border-b border-[#445566]">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold text-white border-2 border-[#99aabb] bg-linear-to-br from-[#445566] to-[#2c3440] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {user.name}
              </h1>
              <span className="bg-[#445566] text-[#99aabb] px-2 py-0.5 rounded text-[0.7rem] uppercase tracking-widest mt-1 inline-block">
                {user.role}
              </span>
            </div>
          </header>
          <section className="p-8 flex flex-col gap-6">
            <div>
              <label className="block text-[#99aabb] text-xs uppercase tracking-widest mb-1">
                User ID
              </label>
              <p className="text-white text-base">{user.id}</p>
            </div>
            <div>
              <label className="block text-[#99aabb] text-xs uppercase tracking-widest mb-2">
                Display Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2c3440] border border-[#445566] p-3 rounded text-white text-sm mb-3 outline-none focus:border-[#00e054] transition-colors"
              />
              <button
                onClick={handleUpdate}
                className="bg-[#00e054] text-black font-bold text-sm px-5 py-2.5 rounded cursor-pointer hover:bg-[#00c04a] transition-colors w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </section>
          <footer className="px-8 py-5 bg-black/20 flex justify-end items-center">
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="text-[#ff8000] border border-[#ff8000] text-xs font-bold uppercase px-4 py-2 rounded cursor-pointer hover:bg-[#ff8000] hover:text-white transition-all mr-auto"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-[#99aabb] border border-[#445566] text-xs uppercase px-4 py-2 rounded cursor-pointer hover:text-white hover:border-white transition-all"
            >
              Logout
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Profile;
