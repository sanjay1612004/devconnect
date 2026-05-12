const express=require("express")
const dbconnect=require('./config/database')
const app=express()
const User=require("./models/user")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const {ValidateSignupData}=require("./utils/validation")
const jwt=require("jsonwebtoken")
// const auth=require("./middleware/auth")
app.use(express.json())
app.use(cookieParser())

const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const authRouter=require("./routes/auth")
const UserRouter=require("./routes/user")
app.use("/",authRouter)
app.use("/",requestRouter)
app.use("/",profileRouter)
app.use("/",UserRouter)

dbconnect().then(()=>{
    console.log("connection successfull")
    app.listen(3000,()=>{
    console.log("server is successfully running on port 3000")
})
}).catch(err=>console.log(err))

