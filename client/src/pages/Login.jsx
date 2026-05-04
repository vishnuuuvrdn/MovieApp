import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login } from "../services/authService";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AuthLayout, {
  inputClass,
  submitBtnClass,
} from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const [, setUser] = useLocalStorage("user", null);

  useEffect(() => {
    if (token){
      navigate("/")
    };
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form.email, form.password);
      setToken(res.data.token);
      setUser(res.data.user);
      window.location.href = "/";
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      onSubmit={handleSubmit}
      footer={
        <p className="mt-5 text-[#99aabb] text-xs text-center">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-white underline cursor-pointer"
          >
            Join Here
          </span>
        </p>
      }
    >
      <input
        className={inputClass}
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={handleChange}
      />
      <input
        className={inputClass}
        type="password"
        name="password"
        placeholder="Password"
        required
        onChange={handleChange}
      />
      {error && (
        <p className="text-[#e05050] text-xs text-center -mt-2">{error}</p>
      )}
      <button type="submit" className={submitBtnClass}>
        Sign In
      </button>
    </AuthLayout>
  );
}

export default Login;
