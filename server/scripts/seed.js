require("dotenv").config();
const mongoose=require("mongoose");
const Job=require("../models/Job");
const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jobs=[
["Frontend Developer Intern","PixelForge","Internship","Remote","₹18k–25k/mo",6.5,["HTML","CSS","JavaScript","React"],"Build responsive user interfaces with the product team."],
["Graduate Software Engineer","TechNova","Full-time","Bengaluru","₹8–12 LPA",7,["Java","DSA","SQL","Git"],"Develop scalable software and solve engineering problems."],
["Data Analyst Intern","InsightWorks","Internship","Gurugram","₹20k/mo",6,["Python","SQL","Excel","Power BI"],"Turn raw data into reports and useful insights."],
["UI/UX Design Intern","Northstar Labs","Internship","Remote","₹15k–20k/mo",6,["Figma","Wireframing","Prototyping"],"Support user research and design web experiences."],
["Backend Developer","CloudSprint","Full-time","Hyderabad","₹7–10 LPA",7.5,["Node.js","Express","MongoDB","REST APIs"],"Build APIs and maintain backend services."],
["Business Development Trainee","Elevate Partners","Full-time","Chandigarh","₹4–6 LPA",6,["Communication","Research","Excel"],"Support market research and business growth."],
["QA Automation Intern","QualityNest","Internship","Pune","₹18k/mo",6.5,["Testing","JavaScript","Playwright","Git"],"Write test cases and automate regression checks."],
["Cloud Support Associate","Nimbus Systems","Full-time","Delhi","₹5–7 LPA",6,["Linux","Networking","Cloud","Troubleshooting"],"Troubleshoot customer issues and learn cloud operations."]
];
(async()=>{try{
 await mongoose.connect(process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/campusconnect");
 if(await Job.countDocuments()===0){
  await Job.insertMany(jobs.map(([title,company,type,location,salary,minCgpa,skills,description])=>({title,company,type,location,salary,minCgpa,skills,description,deadline:new Date(Date.now()+30*86400000)})));
  console.log("Seeded sample jobs.");
 }else console.log("Jobs already exist; leaving existing data unchanged.");
 const adminEmail=(process.env.DEMO_ADMIN_EMAIL||"admin@campusconnect.local").toLowerCase();
 if(!await User.findOne({email:adminEmail})){
  const passwordHash=await bcrypt.hash(process.env.DEMO_ADMIN_PASSWORD||"ChangeMe123!",12);
  await User.create({name:"CampusConnect Admin",email:adminEmail,passwordHash,role:"admin"});
  console.log(`Created demo admin: ${adminEmail} / ${process.env.DEMO_ADMIN_PASSWORD||"ChangeMe123!"}`);
  console.log("Change the demo admin password before any real deployment.");
 }
 await mongoose.disconnect();
}catch(e){console.error(e);process.exit(1)}})();
