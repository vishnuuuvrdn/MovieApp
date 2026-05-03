import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import AuthLayout, {
  inputClass,
  submitBtnClass,
} from "../components/AuthLayout";
import useToast from "../hooks/useToast"

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { token, setToken, setUser } = useAuth();
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (token) navigate("/");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      const res = await login(form.email, form.password);

      if(res.status == 422){
        return showToast("Email Format is Wrong");
      }
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/?welcome=1");
    } catch (err) {
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
