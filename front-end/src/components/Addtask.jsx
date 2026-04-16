import API from "../api/axios";
import { useState } from "react";
import useAuth from "../context/Auth";
const FREQUENCIES = ["Once", "Daily", "Weekly", "Monthly"];
const PRIORITIES = ["Low", "Medium", "High"];


const Addtask = ({ onClose, onAdded, editData }) => {
  const { permission } = useAuth();
  const rem = (permission === "granted") ? false : true;
  const today = new Date().toISOString().split('T')[0];

  const [task, setTask] = useState({
    task: editData?.task || "",
    date: editData?.date || today,
    frequency: editData?.frequency || "",
    priority: editData?.priority || "Medium",
    notification: editData?.notification || "",
    status: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.task.trim()) return;
    setLoading(true);
    try {
      if (editData) {
        await API.put(`/task/${editData._id}`, task);
      } else {
        await API.post("/task/add", task);
      }
      onAdded?.();
      onClose();
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>{editData ? "✏️ Edit Task" : "➕ New Task"}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Task Name *</label>
              <input
                type="text"
                name="task"
                value={task.task}
                onChange={handleChange}
                placeholder="What needs to be done?"
                required
                autoFocus
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label>Due Date</label>
                <input type="date" name="date" value={task.date} onChange={handleChange} min={today} />
              </div>
              <div className="field">
                <label>Priority</label>
                <select name="priority" value={task.priority} onChange={handleChange}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Frequency</label>
                <select name="frequency" value={task.frequency} onChange={handleChange}>
                  {FREQUENCIES.map(f => <option key={f} value={f}>{f || "Once"}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Reminder</label>
                <input style={rem?{cursor:"not-allowed"}:{}}
                  type="text"
                  disabled={rem}
                  name="notification"
                  value={task.notification}
                  placeholder={rem?"Give Notification Permission To Enable This Option":"Yes or No"}
                  // Assuming your state expects "Yes"/"No"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : editData ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addtask;
