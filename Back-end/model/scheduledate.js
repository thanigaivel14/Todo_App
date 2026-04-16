import mongoose from "mongoose";

const Schedule = new mongoose.Schema({
 lastrun:{type:String}
})
const schedule = mongoose.model("schedule",Schedule)
 export default schedule;