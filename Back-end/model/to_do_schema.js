import mongoose from "mongoose";

const Todo_schema = new mongoose.Schema({
  task: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  date: {
    type: String,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Please use the YYYY-MM-DD format'],
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  frequency: { type: String, default: "" },
  notification: { type: String, default: "" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: Boolean, default: false }
}, { timestamps: true });

const Todo = mongoose.model("Todo", Todo_schema);
export default Todo;
