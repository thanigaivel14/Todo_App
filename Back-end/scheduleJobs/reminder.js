import Todo from "../model/to_do_schema.js";
import asyncHandler from "express-async-handler";
import User from "../model/user.js"
import Admin from "../utils/firebaseAdmin.js";

const reminder = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todos = await Todo.find({ status: false, date: { $lte: today }, priority: { $in: ["Medium", "High"] }, notification: { $in: ['Yes', 'yes'] } });
  // Get unique user IDs from the todos
  const userIds = [...new Set(todos.map(todo => todo.user))];
  const users = await User.find({ _id: { $in: userIds } });

  const title = "High Priority Reminder!";
  const body = "You have pending tasks for today.";

  // Loop through each user and send to ALL their registered devices
  users.forEach((user) => {
    if (user.FCMtoken && user.FCMtoken.length > 0) {
      // Pass the entire array of tokens
      sendMulticastNotification(user.FCMtoken, title, body, user._id);
    }
  });

  const now = new Date();
  const hours = now.getHours();
  if (hours >= 23) {
    await strikeUpdate()
  }

  res.status(200).json({ message: "Notifications triggered" });
});

const sendMulticastNotification = async (tokens, title, body, userId) => {
  const message = {
    notification: { title, body },
    tokens: tokens, // Admin SDK expects 'tokens' (plural) for multicast
  };

  try {
    const response = await Admin.messaging().sendEachForMulticast(message);

    // Cleanup: If a token is invalid, remove it from the database
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          // These errors mean the token is no longer valid
          if (resp.error.code === 'messaging/registration-token-not-registered' ||
            resp.error.code === 'messaging/invalid-registration-token' || resp.error.code === 'messaging/invalid-argument') {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      if (failedTokens.length > 0) {

        await User.findByIdAndUpdate(userId, {
          $pull: { FCMtoken: { $in: failedTokens } }
        });
        console.log(`Cleaned up ${failedTokens.length} expired tokens for user ${userId}`);
      }
    }
    return response;
  } catch (error) {
    console.log("Multicast Error:", error.message);
  }
};

const strikeUpdate = async () => {
      const users = await User.find({});
    const update =await Promise.all(users.map(user => checkAndUpdate(user._id)));
  return "strike updated";
}



const checkAndUpdate = async (user_Id) => {
  // ✅ Get tasks of this user only
  const today = new Date().toISOString().split('T')[0];
  const tasks = await Todo.find({ user: user_Id, date: { $lte: today } });

  if (tasks.length === 0) return;

  // ✅ Check if all tasks are done
  const allDone = tasks.every((t) => t.status === true);

  let update;

  if (allDone) {
    // ✅ Increase strike
    update = await User.findByIdAndUpdate(
      user_Id,
      {
        $inc: { strike: 1 },
      },
      { new: true }
    );
  } else {
    // ✅ Decrease strike (but not below 0)
    update = await User.findByIdAndUpdate(
      user_Id,
      {
        $set: { strike: 0 },
      },
      { new: true }
    );
  }

  return update;
}
export default reminder;