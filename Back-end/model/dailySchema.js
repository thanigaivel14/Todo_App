import mongoose from "mongoose";

const DailySchema = new mongoose.Schema({
 todoId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"todos"
 }
},{timestamps:true})


const dailytask = mongoose.model("dailytask",DailySchema);

export default dailytask;