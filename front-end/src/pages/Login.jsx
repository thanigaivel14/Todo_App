import API from "../api/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/Auth";
import '../style/auth.css';

const Login = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onInput = (e) => {
    const { name, value } = e.target;
    setUserinfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/user/login', userinfo);
      if (response.data) {
        await fetchUser();
        navigate('/home');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✅</div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your tasks</p>
        </div>
        <div className="auth-body">
          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}
          <form onSubmit={onLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <span className="icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={userinfo.email}
                  onChange={onInput}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={userinfo.password}
                  onChange={onInput}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <div className="auth-divider"><span>New here?</span></div>
          <div className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
