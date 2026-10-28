const express=require("express");
const {body,validationResult}=require("express-validator");
const User=require("../models/User");
const {requireAuth}=require("../middleware/auth");
const router=express.Router();
const safe=u=>({_id:u._id,name:u.name,email:u.email,role:u.role,course:u.course,college:u.college,graduationYear:u.graduationYear,cgpa:u.cgpa,location:u.location,skills:u.skills,about:u.about});
router.get("/me",requireAuth,(req,res)=>res.json({profile:safe(req.user)}));
router.put("/me",requireAuth,[
 body("name").optional().trim().isLength({min:2,max:100}),body("cgpa").optional({nullable:true}).isFloat({min:0,max:10}),
 body("skills").optional().isArray(),body("email").not().exists().withMessage("Email cannot be changed here.")
],async(req,res,next)=>{try{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:"Invalid profile.",errors:errors.array()});
 const allowed=["name","course","college","graduationYear","cgpa","location","skills","about"];
 const update={};for(const key of allowed)if(req.body[key]!==undefined)update[key]=req.body[key];
 const user=await User.findByIdAndUpdate(req.user._id,update,{new:true,runValidators:true}).select("-passwordHash");
 res.json({message:"Profile updated.",profile:safe(user)});
}catch(e){next(e)}});
module.exports=router;
