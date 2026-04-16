import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectdb from "./database/db.js";
import userRoute from './routes/userRoute.js';
import taskRoute from './routes/taskRoute.js';
import scheduleRouter from "./routes/scheduleRoute.js"
import cors from 'cors';
import schedule from "./scheduleJobs/schedule.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

app.use('/api/user', userRoute);
app.use('/api/task', taskRoute);
app.use('/api/job',scheduleRouter);
connectdb();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
