import cron from "node-cron";
import Todo from "../model/to_do_schema.js";
import schedule from "../model/scheduledate.js";

const backgroundJob = async () => {
  const today = new Date().toISOString().split("T")[0];

  const data = await schedule.findOne();
  const jobdate = data?.lastrun;

  if (jobdate === today) {
    console.log("Already ran today ❌");
    return;
  }

  console.log("Running cron...");

  // ✅ Only tasks completed TODAY
  const tasks = await Todo.find({
    status: true,
    frequency: { $ne: "Once" },
    date: today
  });

  const newTasks = [];

  for (const task of tasks) {
    const newTask = modify(task);

    // ✅ Prevent duplicate
    const exists = await Todo.findOne({
      user: newTask.user,
      task: newTask.task,
      date: newTask.date
    });

    if (!exists) {
      newTasks.push(newTask);
    }
  }

  if (newTasks.length > 0) {
    await Todo.insertMany(newTasks);
    console.log("New recurring tasks created ✅");
  }

  await schedule.findOneAndUpdate(
    {},
    { lastrun: today },
    { upsert: true, new: true }
  );

  console.log("Job completed ✅");
};

function modify(task) {
  let nextDate = new Date(task.date);

  if (task.frequency === "Daily") {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  if (task.frequency === "Weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  }

  if (task.frequency === "Monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return {
    user: task.user,
    task: task.task,
    date: nextDate.toISOString().split("T")[0],
    frequency: task.frequency,
    notification: task.notification,
    priority: task.priority,
    status: false
  };
}

// every hour
cron.schedule("0 * * * *", backgroundJob);

export default cron;