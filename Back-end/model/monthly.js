
import mongoose from "mongoose";

const MonthlySchema = new mongoose.Schema({
 todoId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"todos"
 }
},{timestamps:true})


const monthlytask= mongoose.model("monthlytask",MonthlySchema);

export default monthlytask
;