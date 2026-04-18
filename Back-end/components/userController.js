import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Todo from "../model/to_do_schema.js";
import asyncHandler from 'express-async-handler';

const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production'?'none':"lax",
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
export { register, login, logout, getMe ,tokenUpdate};
