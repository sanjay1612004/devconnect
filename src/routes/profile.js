const express=require("express")
const User=require("../models/user")
const bcrypt=require("bcrypt")

const profileRouter=express.Router()
const auth=require("../middleware/auth")
const jwt=require("jsonwebtoken")
const {ValidateEditProfileData,ValidateEditPassword}=require("../utils/validation")

profileRouter.get("/profile/view",auth,async(req,res)=>{
    try{
        const token=req.cookies.token
        const decodedmessage=jwt.decode(token)
        console.log(decodedmessage)
        const {UserId}=decodedmessage
        console.log(UserId)
        const user=await User.findOne({_id:UserId})
        res.send(user)
    }catch(err){
        res.status(404).send("something went wrong"+" "+err.message)
    }

})

profileRouter.patch("/profile/edit",auth,async(req,res)=>{
    try{
        if (!ValidateEditProfileData(req)){
        throw new Error("some fields are not allowed to edit")
        }
        const loggedInUser=req.user
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
        await loggedInUser.save()
        res.json({Message:"profile updated successfully",data:loggedInUser})
    }
    catch(err){
        res.status(404).send("something went wrong"+" "+err.message)

    }
    

})

profileRouter.patch("/profile/password",auth,async(req,res)=>{
    try{
        const user=req.user
        if (!ValidateEditPassword(req)){
            throw new Error("any feilds other than password cant be modified")

        }
        if (!user){
            throw new Error("no user found")
        }
        const hashedpassword=await bcrypt.hash(req.body.password,10)
        user.password=hashedpassword
        await user.save()
        res.send("password updated successfully")

    }catch(err){
        res.status(400).send("err occured"+err.message)
    }
    
})

module.exports=profileRouter