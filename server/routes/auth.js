const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {body,validationResult}=require("express-validator");
const User=require("../models/User");
const {requireAuth}=require("../middleware/auth");
const router=express.Router();
const validate=(req,res,next)=>{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:"Please correct the submitted details.",errors:errors.array()});next();};
const publicUser=u=>({_id:u._id,name:u.name,email:u.email,role:u.role,course:u.course,college:u.college,graduationYear:u.graduationYear,cgpa:u.cgpa,location:u.location,skills:u.skills,about:u.about});
router.post("/register",[
 body("name").trim().isLength({min:2,max:100}),
 body("email").trim().isEmail().normalizeEmail(),
 body("password").isLength({min:8}).withMessage("Password must be at least 8 characters.")
],validate,async(req,res,next)=>{try{
 const {name,email,password}=req.body;
 if(await User.findOne({email}))return res.status(409).json({message:"An account with this email already exists."});
 const passwordHash=await bcrypt.hash(password,12);
 const user=await User.create({name,email,passwordHash,role:"student"});
 const token=jwt.sign({sub:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||"7d"});
 res.status(201).json({message:"Registration successful.",token,user:publicUser(user)});
}catch(e){next(e)}});
router.post("/login",[
 body("email").trim().isEmail().normalizeEmail(),body("password").isString().notEmpty()
],validate,async(req,res,next)=>{try{
 const user=await User.findOne({email:req.body.email});
 if(!user||!(await bcrypt.compare(req.body.password,user.passwordHash)))return res.status(401).json({message:"Email or password is incorrect."});
 const token=jwt.sign({sub:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||"7d"});
 res.json({message:"Login successful.",token,user:publicUser(user)});
}catch(e){next(e)}});
router.get("/me",requireAuth,(req,res)=>res.json({user:publicUser(req.user)}));
module.exports=router;
