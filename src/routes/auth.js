const express=require("express")

const authRouter=express.Router()
const User=require("../models/user")
const {ValidateSignupData}=require("../utils/validation")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


authRouter.post("/signup",async(req,res)=>{
    
    try{
        //api level validation of data
        ValidateSignupData(req)
        //encyrpt password
        const {firstName,lastName,emailId,password}=req.body
        const passwordHash=await bcrypt.hash(password,10)
        console.log(passwordHash)
        //store in database
        const user=new User({
            firstName,lastName,emailId,password:passwordHash
        })

        await user.save()
        res.send("user added successfully")
    }
    catch(err){
        res.status(400).send("failed to save data in database"+err.message)
    }
   
})

authRouter.post("/login",async(req,res)=>{
    
    try{
        const {emailId,password}=req.body
        const user=await User.findOne({emailId:emailId})
        if (!user){
            throw new Error("invalid credential")
        }
        const ispasswordmatch=await bcrypt.compare(password,user.password)
        if (ispasswordmatch){
            // res.send("login successful")
            const token=await user.getJWT()
            res.cookie("token",token,{expires:new Date(Date.now()+7*3600000)})
            res.send(user)
        }
        else{
            throw new Error("invalid credential")

        }
    }catch(err){
        res.status(404).send("something went wrong"+" "+err.message)
    }
    
})


authRouter.post("/logout",(req,res)=>{
    try{
        res.clearCookie("token")
        res.send("logout sucessful")
    }
    catch(err){
        res.status(400).send("err occured"+err.message)
    }
    
})


module.exports=authRouter