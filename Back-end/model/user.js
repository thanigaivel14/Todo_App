import mongoose, { Types } from "mongoose"

const userschema = mongoose.Schema({
                    name:{type:String,required:true},
                    password:{type:String,required:true},
                    email:{type:String,required:true},
                    strike:{type:Number,default:0},
                    strikeUpdatedDate:{type:String,default:"new"},
                    FCMtoken:[{type:String,}]
})

const User= mongoose.model("User",userschema)

export default User;