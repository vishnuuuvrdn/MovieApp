import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
      alert("Welcome to the community!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Join CineScope</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            className="register-input"
            type="text"
            name="text"
            id="text"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email Address</label>
          <input
            className="register-input"
            type="email"
            name="email"
            id="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            className="register-input"
            type="password"
            name="password"
            id="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="register-button" type="submit">
            Create Account
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
