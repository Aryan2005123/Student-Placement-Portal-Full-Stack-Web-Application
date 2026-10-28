const jwt = require("jsonwebtoken");
const User = require("../models/User");
async function requireAuth(req,res,next){
  try{
    const header=req.headers.authorization||"";
    if(!header.startsWith("Bearer ")) return res.status(401).json({message:"Sign in to continue."});
    const payload=jwt.verify(header.slice(7),process.env.JWT_SECRET);
    const user=await User.findById(payload.sub).select("-passwordHash");
    if(!user) return res.status(401).json({message:"Account no longer exists."});
    req.user=user; next();
  }catch(e){return res.status(401).json({message:"Invalid or expired token."});}
}
function requireAdmin(req,res,next){if(!req.user||req.user.role!=="admin")return res.status(403).json({message:"Admin access required."});next();}
module.exports={requireAuth,requireAdmin};
