import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router-dom";
import './index.css';
import useAuth from "./context/Auth.jsx";

const App = () => {
  const {user} =useAuth();

  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={user?<Home />:<Login/>} />
    </Routes>
  );
};

export default App;
