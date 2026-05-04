import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import AuthLayout, {
  inputClass,
  submitBtnClass,
} from "../components/AuthLayout";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { token, setToken, setUser } = useAuth();

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      const res = await login(form.email, form.password);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/?welcome=1");
    } catch (err) {
      if(err.response?.status === 422){
        setError("ENTER VALID EMAIL!")
      }
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Join CineScope"
      onSubmit={handleSubmit}
      footer={
        <p className="mt-5 text-[#99aabb] text-xs text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-white underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      }
    >
      <input
        className={inputClass}
        type="text"
        name="name"
        placeholder="Name"
        required
        onChange={handleChange}
      />
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
        Create Account
      </button>
    </AuthLayout>
  );
}

export default Register;
