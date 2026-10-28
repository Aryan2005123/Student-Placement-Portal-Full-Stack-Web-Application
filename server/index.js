require("dotenv").config();
const path=require("path");
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const authRoutes=require("./routes/auth");
const jobRoutes=require("./routes/jobs");
const studentRoutes=require("./routes/students");
const applicationRoutes=require("./routes/applications");
const app=express();
app.use(cors());
app.use(express.json({limit:"1mb"}));
app.get("/api/health",(req,res)=>res.json({ok:true,service:"CampusConnect API",database:mongoose.connection.readyState===1?"connected":"disconnected"}));
app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/students",studentRoutes);
app.use("/api/applications",applicationRoutes);
app.use(express.static(path.join(__dirname,"..","public")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"..","public","index.html")));
app.use((err,req,res,next)=>{
 console.error(err);
 if(err.code===11000)return res.status(409).json({message:"A record with this information already exists."});
 if(err.name==="CastError")return res.status(400).json({message:"Invalid identifier."});
 if(err.name==="ValidationError")return res.status(400).json({message:err.message});
 res.status(500).json({message:"An unexpected server error occurred."});
});
const port=Number(process.env.PORT||5000);
mongoose.connect(process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/campusconnect")
 .then(()=>{console.log("MongoDB connected");app.listen(port,()=>console.log(`CampusConnect running at http://localhost:${port}`));})
 .catch(err=>{console.error("Could not connect to MongoDB:",err.message);console.error("Start MongoDB and verify MONGODB_URI in .env.");process.exit(1);});
