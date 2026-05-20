const mongoose=require("mongoose")
const User=require("../models/user")

const jwt=require("jsonwebtoken")
const auth=async(req,res,next)=>{
    try{
    const token=req.cookies.token
    const user=jwt.verify(token,"DevConnect@2026")
    // console.log("isvalidate",isvalidate)
    const {UserId}=user
    console.log("user is",user)
    if (!user){
            throw new Error("you are not authorised")
        }
    const details=await User.findById({_id:UserId})
    req.user=details
    next()
    }catch(err){
        
res.status(401).send("some err occured " + err.message)
    }
    
}

module.exports=auth