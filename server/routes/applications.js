const express=require("express");
const {body,validationResult}=require("express-validator");
const Application=require("../models/Application");
const Job=require("../models/Job");
const {requireAuth,requireAdmin}=require("../middleware/auth");
const router=express.Router();
router.post("/",requireAuth,[body("jobId").isMongoId(),body("coverNote").optional().isLength({max:2000}),body("cgpa").optional().isFloat({min:0,max:10})],async(req,res,next)=>{try{
 const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:"Invalid application details.",errors:errors.array()});
 const job=await Job.findOne({_id:req.body.jobId,isActive:true});if(!job)return res.status(404).json({message:"Job not found or no longer active."});
 const exists=await Application.findOne({student:req.user._id,job:job._id});if(exists)return res.status(409).json({message:"You have already applied for this job."});
 const app=await Application.create({student:req.user._id,job:job._id,coverNote:req.body.coverNote||"",cgpaAtApplication:req.body.cgpa??req.user.cgpa});
 const populated=await app.populate([{path:"job"},{path:"student",select:"name email"}]);
 res.status(201).json({message:"Application submitted.",application:populated});
}catch(e){next(e)}});
router.get("/mine",requireAuth,async(req,res,next)=>{try{const applications=await Application.find({student:req.user._id}).populate("job").sort({appliedAt:-1});res.json({applications});}catch(e){next(e)}});
router.get("/",requireAuth,requireAdmin,async(req,res,next)=>{try{const applications=await Application.find().populate("job").populate("student","name email course cgpa").sort({appliedAt:-1});res.json({applications});}catch(e){next(e)}});
router.patch("/:id/status",requireAuth,requireAdmin,[body("status").isIn(["Applied","Pending","Shortlisted","Rejected"])],async(req,res,next)=>{try{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:"Invalid status."});const application=await Application.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true}).populate("job").populate("student","name email");if(!application)return res.status(404).json({message:"Application not found."});res.json({message:"Application status updated.",application});}catch(e){next(e)}});
module.exports=router;
