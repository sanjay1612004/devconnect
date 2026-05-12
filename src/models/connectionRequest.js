const mongoose=require("mongoose")

const ConnectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"

    },
    status:{
        type:String,
        enum:{
            values:["accepted","rejected","interested","ignored"],
            message:"other values are not accepted except this"

        }
    }
},{timestamps:true})

ConnectionRequestSchema.pre("save",async function (next){
    const connectionrequest=this
    if (connectionrequest.fromUserId.equals(connectionrequest.toUserId)){
        throw new Error("you can't send request to yourself")
    }
})

const connectionRequestModel=new mongoose.model("connectionRequest",ConnectionRequestSchema)
module.exports=connectionRequestModel