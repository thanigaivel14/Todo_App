import { useState } from "react";

const Filter = ({ onFilter, onClear }) => {
  const [condition, setCondition] = useState({ status: "All", priority: "All" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCondition((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(condition);
  };

  const handleClear = () => {
    setCondition({ status: "", priority: "" });
    onClear();
  };

  return (
    <div className="filter-panel">
      <h4>🔍 Filter Tasks</h4>
      <form onSubmit={handleSubmit}>
        <div className="filter-fields">
          <div className="field">
            <label>Status</label>
            <select name="status" value={condition.status} onChange={handleChange}>
              <option value="">All</option>
              <option value="Done">Done ✅</option>
              <option value="Pending">Pending ⏳</option>
            </select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select name="priority" value={condition.priority} onChange={handleChange}>
              <option value="">All</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn-filter">Apply</button>
            <button type="button" className="btn-clear" onClick={handleClear}>Clear</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filter;
