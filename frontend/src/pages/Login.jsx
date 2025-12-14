import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (isAdminLogin && role !== "ADMIN") {
        alert("You must login using ADMIN credentials");
        return;
      }

      if (!isAdminLogin && role === "ADMIN") {
        alert("Please check 'Login as Admin'");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <label>
          <input type="checkbox" onChange={() => setIsAdminLogin(!isAdminLogin)} />
          Login as Admin
        </label>

        <button>Login</button>
      </form>

      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
