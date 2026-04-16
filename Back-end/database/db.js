import mongoose, { connect } from "mongoose";

const connectdb= ()=>{mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected!')).catch((e)=>{
                    console.log(`The error: ${e.message}`)
  });}

  export default connectdb;