import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sign In</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="login-input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        <p className="footer-text">
          New here? <span onClick={() => navigate("/register")}>Join Here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
