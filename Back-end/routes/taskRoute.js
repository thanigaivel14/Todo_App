import e from "express";
import protect from "../middleware/protect.js";
import { add, userTask, markAsDone, deleteTask, editTask, filter } from "../components/task.js";

const router = e.Router();
router.post('/add', protect, add);
router.get('/', protect, userTask);
router.put('/:id/toggle', protect, markAsDone);
router.put('/:id', protect, editTask);
router.delete('/:id', protect, deleteTask);
router.get('/filter', protect, filter);


export default router;
