
const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
//schema level validation
const UserSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("email is not valid :"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if (!validator.isStrongPassword(value)){
                throw new Error("ur password is not strong : "+value)
            }
        }
    },
    about:{
        type:String,
        default:"this is default about of user"
    },
    gender:{
        type:String,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error("gender not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg",
        validate(value){
            if (!validator.isURL(value)){
                throw new Error("it is not validate url")
            }
        }
    },
    Skills:{
        type:[String],
        default:["js","react","python"]
    },
    Age:{
        type:Number
    }
})

UserSchema.methods.getJWT=async function(req,res){
    const user=this
    const token=await jwt.sign({UserId:user._id},"DevConnect@2026",{expiresIn:"1d"})
    return token

}
const User=mongoose.model("User",UserSchema)
module.exports=User

