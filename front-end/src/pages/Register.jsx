import API from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../style/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onInput = (e) => {
    const { name, value } = e.target;
    setUserinfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/user/register', userinfo);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🚀</div>
          <h1>Create Account</h1>
          <p>Start organizing your tasks today</p>
        </div>
        <div className="auth-body">
          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="auth-error" style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#166534' }}>
              <span>✅</span> Account created! Redirecting to login...
            </div>
          )}
          <form onSubmit={onRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <span className="icon">👤</span>
                <input
                  type="text"
                  name="name"
                  value={userinfo.name}
                  onChange={onInput}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>
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
                  placeholder="Choose a strong password"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading || success}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <div className="auth-divider"><span>Already registered?</span></div>
          <div className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
