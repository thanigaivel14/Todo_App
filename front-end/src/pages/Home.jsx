import useAuth from "../context/Auth.jsx";
import API from "../api/axios.js";
import { useState, useEffect, useCallback, useMemo } from "react";
import "../style/home.css";
import Addtask from "../components/Addtask.jsx";
import Filter from "../components/Filter.jsx";
import Toast from "../components/Toast.jsx";
import { generateToken } from "../utils/firebase.js";
const Home = () => {
  const { user, loading, logout,permission ,alertPermission} = useAuth();
  const [list, setList] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  // ✅ Prevent multiple strike calls
  const [strikeUpdated, setStrikeUpdated] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const listFetch = useCallback(async () => {
    try {
      const res = await API.get("/task/");
      setList(res.data);
      setStrikeUpdated(false); // reset when new data loads
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    if (user) listFetch();
  }, [user, listFetch]);

  // ✅ useMemo for performance
  const doneCount = useMemo(() => {
    return list.filter((t) => t.status).length;
  }, [list]);
  
  useEffect (()=>{
    const FCMtoken = async()=>{
    if(permission=="granted"){
    try {
        const res= await generateToken();

        const response = await API.post("user/save-token",{token:res});
    } catch (error) {
      console.log("error:",error.message)
    }

  }
  else{
   alertPermission();
}
}
FCMtoken();


  },[])

  const pendingCount = list.length - doneCount;
  const progress =
    list.length > 0 ? Math.round((doneCount / list.length) * 100) : 0;



  const handleToggle = async (id) => {
    try {
      const res = await API.put(`/task/${id}/toggle`);
      setList((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
      showToast(
        res.data.status
          ? "Task marked as done! 🎉"
          : "Task marked as pending"
      );
    } catch (error) {
      showToast("Failed to update task", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/task/${id}`);
      setList((prev) => prev.filter((t) => t._id !== id));
      showToast("Task deleted");
    } catch (error) {
      showToast("Failed to delete task", "error");
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowAddTask(true);
  };

  const handleTaskSaved = () => {
    listFetch();
    showToast(editTask ? "Task updated! ✏️" : "Task added! ✅");
    setEditTask(null);
  };

  const handleFilter = async (condition) => {
    try {
      const res = await API.get("/task/filter", {
        params: condition,
      });
      setList(res.data);
      setIsFiltered(true);
    } catch (error) {
      showToast("Filter failed", "error");
    }
  };

  const handleClearFilter = () => {
    setIsFiltered(false);
    listFetch();
  };

  const handleLogout = async () => {
    try {
      await API.post("/user/logout");
    } catch (_) { }
    logout();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="loading-screen">
        <p>
          Please{" "}
          <a href="/login" style={{ color: "var(--primary)" }}>
            log in
          </a>{" "}
          to see your tasks.
        </p>
      </div>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">✅</div>
          <h2>TaskFlow</h2>
        </div>
        <div className="navbar-right">
          <div className="strike-badge">
  <span className="strike-icon">🔥</span>
  <span className="strike-count">{user?.strike}</span>
</div>
          <div className="user-badge">
            <div className="user-avatar">{initials}</div>
            <span>{user.name}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⬅️</span> Logout
          </button>
        </div>
      </nav>

      <div className="home-main">
        {/* Stats */}
        <div className="sticky-summary">
        <div className="stats-bar">
          <div className="stat-card total">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{list.length}</div>
          </div>
          <div className="stat-card done">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{doneCount}</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>

        {/* Progress */}
        {list.length > 0 && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            
          </div>
        )}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="toolbar-title">
              {isFiltered ? "Filtered Results" : "My Tasks"}
            </span>
            <span className="task-count-badge">{list.length}</span>
          </div>
          <div className="toolbar-right">
            <button
              className={`filter-btn ${showFilter ? "active" : ""}`}
              onClick={() => setShowFilter((p) => !p)}
            >
              🔍 Filter
            </button>
            <button
              className="add-btn"
              onClick={() => {
                setEditTask(null);
                setShowAddTask(true);
              }}
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Filter */}
        {showFilter && (
          <Filter onFilter={handleFilter} onClear={handleClearFilter} />
        )}

        {/* Task List */}
        <div className="task-grid">
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>
                {isFiltered
                  ? "No tasks match your filter"
                  : "No tasks yet"}
              </h3>
              <p>
                {isFiltered
                  ? "Try different filter options"
                  : "Click '+ Add Task' to get started!"}
              </p>
            </div>
          ) : (
            list.map((item) => (
              <div
                key={item._id}
                className={`task-card ${item.status ? "done" : ""
                  } ${item.date !== today ? "prev" : ""}`}
              >
                <div className="task-card-header">
                  <div
                    className={`task-check ${item.status ? "checked" : ""
                      }`}
                    onClick={() => handleToggle(item._id)}
                  >
                    {item.status && "✓"}
                  </div>
                  <span className="task-title">{item.task}</span>
                  <div className="task-actions">
                    <button className="task-action-btn edit" onClick={() => handleEdit(item)}>
                      ✏️
                    </button>
                    <button
                      className="task-action-btn delete"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="task-meta">
                  {item.date && (
                    <span className="meta-chip">📅 {item.date}</span>
                  )}
                  {item.frequency && (
                    <span className="meta-chip">🔁 {item.frequency}</span>
                  )}
                  {item.notification && (
                    <span className="meta-chip">⏰ {item.notification}</span>
                  )}
                  <span className={`priority-badge ${item.priority || "Medium"}`}>
                    {item.priority || "Medium"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddTask && (
        <Addtask
          onClose={() => {
            setShowAddTask(false);
            setEditTask(null);
          }}
          onAdded={handleTaskSaved}
          editData={editTask}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  );
};

export default Home;