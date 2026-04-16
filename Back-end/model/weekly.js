import mongoose from "mongoose";

const WeeklySchema = new mongoose.Schema({
 todoId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"todos"
 }
},{timestamps:true})


const weeklytask = mongoose.model("weeklytask",WeeklySchema);

export default weeklytask;