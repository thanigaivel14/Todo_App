import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ permission,setPermission] = useState(Notification.permission);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get('/user/me');
      if (res.data) setUser(res.data.userinfo);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const publicPaths = ["/login", "/register","/"];
    if (!publicPaths.includes(window.location.pathname)) {
      fetchUser();
    } else {
      setLoading(false);
    }
    if (Notification.permission === "granted") {
    setPermission("granted");
    }
    
  }, []);

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const alertPermission = async()=>{
  const permission = await Notification.requestPermission();
    if(permission==="granted"){
      setPermission("granted");
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout,alertPermission,permission }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export default useAuth;
