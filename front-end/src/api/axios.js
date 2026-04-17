import axios from "axios"
const url=import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API =axios.create({
          baseURL: url,
          withCredentials:true
})

export default API;