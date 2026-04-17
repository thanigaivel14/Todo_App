import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Todo from "../model/to_do_schema.js";
import asyncHandler from 'express-async-handler';

const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

const cookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000
};

// Register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('All fields are required');
  }
  const exist = await User.findOne({ email });
  if (exist) { res.status(400); throw new Error('User already exists!'); }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashPass });

  if (user) {
    res.cookie('token', token(user._id), cookieOptions)
      .status(201)
      .json({ user: { _id: user._id, name: user.name, email: user.email } });
  } else {
    res.status(400); throw new Error('Invalid user data');
  }
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password required'); }

  const exist = await User.findOne({ email });
  if (!exist) { res.status(404); throw new Error('User not found'); }

  const isMatch = await bcrypt.compare(password, exist.password);
  if (!isMatch) { res.status(400); throw new Error('Invalid password'); }

  res.cookie('token', token(exist._id), cookieOptions)
    .status(200)
    .json({ user: { _id: exist._id, name: exist.name, email: exist.email } });
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logged out successfully' });
});

// Get me
const getMe = asyncHandler(async (req, res) => {
  if (req.user) {
    res.status(200).json({ userinfo: req.user });
  } else {
    res.status(404).json({ message: "User not logged in" });
  }
});


//chech strike
const strikeCheck = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const { _id, strike, strikeUpdatedDate } = req.user;

  // ✅ Get tasks of this user only
  let tasks;
  
   tasks = await Todo.find({ user: _id ,date:{$lte:today}});

  if (tasks.length === 0) {
    return res.json({ message: "No tasks" });
  }

  // ✅ Check if all tasks are done
  const allDone = tasks.every((t) => t.status === true);

  let update;

  if (allDone) {
    // ✅ Increase strike
      if (strikeUpdatedDate === today) {
   return  res.send({ message: "Already updated today" });
  }
    update = await User.findByIdAndUpdate(
      _id,
      {
        $inc: { strike: 1 },
        $set: { strikeUpdatedDate: today }
      },
      { new: true }
    );
  } else {
    // ✅ Decrease strike (but not below 0)
    if(strikeUpdatedDate ==='new'){
     return  res.send({message:"complete first"})
    }
    update = await User.findByIdAndUpdate(
      _id,
      {
        $set: { strike:0,strikeUpdatedDate: "new" },
      },
      { new: true }
    );
  }

 return  res.json({
    strike: update.strike,
    allDone
  });
});

const tokenUpdate = asyncHandler(async(req,res)=>{
  const {token}= req.body;
  const {_id} = req.user;
  if(token){
    await User.findByIdAndUpdate(_id,{$addToSet:{ FCMtoken: token }},{new:true})
    res.status(200).json({message:"token updated"})
  }
  else{
    res.status(404).json({message:"token not updated"});
  }

})
export { register, login, logout, getMe ,strikeCheck,tokenUpdate};
