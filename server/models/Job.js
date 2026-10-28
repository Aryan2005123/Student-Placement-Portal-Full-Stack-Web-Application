const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:120},
  company:{type:String,required:true,trim:true,maxlength:120},
  type:{type:String,enum:["Full-time","Internship","Part-time"],default:"Full-time"},
  location:{type:String,default:"Remote"},
  salary:{type:String,default:"Not specified"},
  minCgpa:{type:Number,min:0,max:10,default:0},
  deadline:{type:Date,default:null},
  skills:{type:[String],default:[]},
  description:{type:String,default:""},
  isActive:{type:Boolean,default:true},
  createdBy:{type:require("mongoose").Schema.Types.ObjectId,ref:"User",default:null}
},{timestamps:true});
module.exports = mongoose.model("Job",jobSchema);
