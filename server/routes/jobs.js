const express=require("express");
const {body,validationResult}=require("express-validator");
const Job=require("../models/Job");
const {requireAuth,requireAdmin}=require("../middleware/auth");
const router=express.Router();
const validate=(req,res,next)=>{const e=validationResult(req);if(!e.isEmpty())return res.status(400).json({message:"Invalid job details.",errors:e.array()});next();};
router.get("/",async(req,res,next)=>{try{
 const filter={isActive:true};
 if(req.query.type)filter.type=req.query.type;
 if(req.query.location)filter.location=new RegExp(req.query.location.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");
 if(req.query.minCgpa)filter.minCgpa={$lte:Number(req.query.maxCgpa||10)};
 if(req.query.q){const rx=new RegExp(req.query.q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");filter.$or=[{title:rx},{company:rx},{location:rx},{skills:rx}];}
 const jobs=await Job.find(filter).sort({createdAt:-1}).limit(200);
 res.json({jobs});
}catch(e){next(e)}});
router.get("/:id",async(req,res,next)=>{try{const job=await Job.findOne({_id:req.params.id,isActive:true});if(!job)return res.status(404).json({message:"Job not found."});res.json({job});}catch(e){next(e)}});
router.post("/",requireAuth,requireAdmin,[
 body("title").trim().notEmpty().isLength({max:120}),body("company").trim().notEmpty().isLength({max:120}),
 body("type").optional().isIn(["Full-time","Internship","Part-time"]),
 body("minCgpa").optional().isFloat({min:0,max:10}),body("skills").optional().isArray()
],validate,async(req,res,next)=>{try{const job=await Job.create({...req.body,createdBy:req.user._id});res.status(201).json({message:"Job created.",job});}catch(e){next(e)}});
router.patch("/:id",requireAuth,requireAdmin,async(req,res,next)=>{try{const job=await Job.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!job)return res.status(404).json({message:"Job not found."});res.json({job});}catch(e){next(e)}});
router.delete("/:id",requireAuth,requireAdmin,async(req,res,next)=>{try{const job=await Job.findByIdAndUpdate(req.params.id,{isActive:false},{new:true});if(!job)return res.status(404).json({message:"Job not found."});res.json({message:"Job archived."});}catch(e){next(e)}});
module.exports=router;
