const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  job:{type:mongoose.Schema.Types.ObjectId,ref:"Job",required:true},
  coverNote:{type:String,default:"",maxlength:2000},
  cgpaAtApplication:{type:Number,min:0,max:10,default:null},
  status:{type:String,enum:["Applied","Pending","Shortlisted","Rejected"],default:"Pending"},
  appliedAt:{type:Date,default:Date.now}
},{timestamps:true});
applicationSchema.index({student:1,job:1},{unique:true});
module.exports=mongoose.model("Application",applicationSchema);
