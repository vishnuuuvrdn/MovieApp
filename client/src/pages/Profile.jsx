import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if(!token || ! user) return null;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>👤 Profile</h1>

      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <br />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout 🚪
      </button>
    </div>
  );
}

export default Profile;
