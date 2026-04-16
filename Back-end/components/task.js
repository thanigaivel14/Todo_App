import Todo from "../model/to_do_schema.js";
import dailytask from "../model/dailySchema.js"
import weeklytask from "../model/weekly.js"
import monthlytask from "../model/monthly.js"
import asyncHandler from 'express-async-handler';
// import { sendnotification } from "../service/notification.js";
// Add task
const add = asyncHandler(async (req, res) => {
  const newTodo = new Todo({
    task: req.body.task,
    user: req.user._id,
    date: req.body.date,
    frequency: req.body.frequency || "Once",
    notification: req.body.notification,
    priority: req.body.priority || "Medium",
    status: false
  });
  const saved = await newTodo.save();
  let task,s;
  const frequency = req.body.frequency
  switch(frequency){
  case "Daily":
    task = new dailytask({todoId:saved._id})
    s=await task.save();
    break;
  case "Weekly":
    task = new weeklytask({todoId:saved._id})
    s=await task.save();
    break;
  case "Monthly":
    task = new monthlytask({todoId:saved._id})
    s= await task.save();
    break;

  }
  res.status(201).json(saved);
});

// Fetch  user tasks
const userTask = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const today = new Date().toISOString().split('T')[0];

 const query = {
    user,
    $or: [
      {
        date: today,
      },
      // ✅ Previous days incomplete tasks
      {
        date: { $lt: today },
        status: false
      }
    ]
  };
  const todos = await Todo.find(query).sort({date:1});
  res.json(todos);
});

// Toggle status (done/undone)
const markAsDone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.status = !todo.status;
  await todo.save();
  res.status(200).json(todo);
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.status(200).json({ message: "Deleted successfully" });
});

// Edit task
const editTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Todo.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { ...req.body },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Todo not found" });
  res.status(200).json(updated);
});

// Filter
const filter = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const today = new Date().toISOString().split('T')[0];
  let query = { user: req.user._id,date:today};
  if (status && status !== "All") query.status = status === "Done";
  if (priority && priority !== "All") query.priority = priority;

  const tasks = await Todo.find(query).sort({ createdAt: -1 });
  res.json(tasks);
});



export { add, userTask, markAsDone, deleteTask, editTask, filter };
