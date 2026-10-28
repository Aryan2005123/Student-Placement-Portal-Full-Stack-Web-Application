const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {type:String, required:true, trim:true, maxlength:100},
  email: {type:String, required:true, unique:true, lowercase:true, trim:true},
  passwordHash: {type:String, required:true},
  role: {type:String, enum:["student","admin"], default:"student"},
  course: {type:String, default:""}, college: {type:String, default:""},
  graduationYear: {type:Number, default:null}, cgpa: {type:Number, min:0, max:10, default:null},
  location: {type:String, default:""}, skills: {type:[String], default:[]},
  about: {type:String, default:""}
},{timestamps:true});
module.exports = mongoose.model("User", userSchema);
