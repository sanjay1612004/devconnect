const express=require("express")
const User=require("../models/user")

const requestRouter=express.Router()
const auth=require("../middleware/auth")
const connectionRequest=require("../models/connectionRequest")
const { default: mongoose } = require("mongoose")

requestRouter.post("/request/send/:status/:toUserId",auth,async(req,res)=>{
    try{
        const fromUserId=req.user._id
    const toUserId=req.params.toUserId
    const status=req.params.status
    
    const allowedStatus=["interested","ignored"]
    if (!allowedStatus.includes(status)){
        return res.status(400).json({message:"invalid status type"})
    }

   

    const existingrequest=await connectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if (existingrequest){
        return res.status(400).json({message:"connection request exist already"})
    }
     const user=await User.findById(toUserId)
    if (!user){
        return res.status(400).json({message:"No user found"})

    }
    const request=new connectionRequest({fromUserId,toUserId,status})
    const data=await request.save()
        res.json({
            message:status==="interested"?"message sent successfully":"message ignored successfully",
            data
        })
    }
    catch(err){
        res.status(400).send("some err occured  "+err.message)
    }
    
})


requestRouter.post("/request/review/:status/:requestId",auth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const {status,requestId}=req.params
        const allowedstatus=["accepted","rejected"]
        if (!allowedstatus.includes(status)){
            return res.status(400).json({message:"invalid status"})
        }
        const Request=await connectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if (!Request){
            return res.status(400).json({
        message:"request not found"
    })
        }
        Request.status=status
        const data=await Request.save()
        res.json({message:"connection request "+status,data})

    }catch(err){
        res.status(400).send("err occured"+err.message)
    }
})

module.exports=requestRouter