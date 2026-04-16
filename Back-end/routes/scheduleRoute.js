import e from "express";
import reminder from "../scheduleJobs/reminder.js";
const router = e.Router();

router.get('/reminder',reminder);
 export default router;