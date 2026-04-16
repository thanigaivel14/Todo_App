import jwt from "jsonwebtoken"
import User from "../model/user.js"

const protect = async(req,res,next)=>{
 const token = req.cookies.token;
 if (!token|| token==='undefined') {
        console.log(token)
     return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
          const decoded =  jwt.verify(token,process.env.JWT_SECRET)
          req.user = await User.findById(decoded.id).select('-password');
          next();
  } catch (error) {
          return res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

export default protect