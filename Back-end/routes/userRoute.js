import e from "express";
import { register, login, logout, getMe, tokenUpdate } from '../components/userController.js';
import protect from "../middleware/protect.js";

const router = e.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/save-token', protect, tokenUpdate);



export default router;
