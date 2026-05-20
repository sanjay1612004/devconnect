const express=require("express")
const auth = require("../middleware/auth")
const connectionRequest=require("../models/connectionRequest")
const User = require("../models/user")

const UserRouter=express.Router()

UserRouter.get("/user/request/recieved",auth,async(req,res)=>{
    try{
        const loggedInuser=req.user
        const requests=await connectionRequest.find({
            toUserId:loggedInuser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","about","skills"])
        res.json({
            message:"connections requests",
            data:requests
        })
    }
    catch(err){
        res.status(400).send("err occured "+err.message)
    }
})

UserRouter.get("/user/connections",auth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const requests=await connectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},

            ]
        }).populate("fromUserId",["firstName","lastName","photoUrl","about","skills"]).
        populate("toUserId",["firstName","lastName","photoUrl","about","skills"])
        const data=requests.map(x=>{
            if(x.fromUserId._id.toString()==loggedInUser._id.toString()){
                return x.toUserId
            }
            return x.fromUserId
            }
        )


        res.json({message:"connect request are",data:{data}})

    }catch(err){
        res.status(400).send("err occured"+err.message)
    }
})



UserRouter.get("/feed",auth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const page=parseInt(req.query.page) || 1
        let limit=parseInt(req.query.limit) || 10
        limit=limit>50?50:limit
        const skip=(page-1)*limit
        const request=await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId").populate("fromUserId","firstName").populate("toUserId","firstName")
        const hideuserfromfeed=new Set()
        request.forEach((req)=>{
            hideuserfromfeed.add(req.fromUserId)
            hideuserfromfeed.add(req.toUserId)
        })
        console.log(hideuserfromfeed)

        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideuserfromfeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl about Skills").skip(skip).limit(limit)
        res.json(users)
    }
    catch(err){
        res.status(400).send("err occured"+err.message)
    }
})

module.exports=UserRouter