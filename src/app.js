const express=require("express")
const dbconnect=require('./config/database')
const app=express()
const User=require("./models/user")
const bcrypt=require("bcrypt")
const {ValidateSignupData}=require("./utils/validation")

app.use(express.json())

app.post("/signup",async(req,res)=>{
    // console.log(req.body)
   

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


app.post("/login",async(req,res)=>{
    
    try{
        const {emailId,password}=req.body
        const user=await User.findOne({emailId:emailId})
        if (!user){
            throw new Error("invalid credential")
        }
        const ispasswordmatch=await bcrypt.compare(password,user.password)
        if (ispasswordmatch){
            res.send("login successful")
        }
        else{
            throw new Error("invalid credential")

        }
    }catch(err){
        res.status(404).send("something went wrong"+" "+err.message)
    }
    
})


app.get("/user",async(req,res)=>{
    const userEmailId=req.body.emailId
    try{
       const user= await User.find({emailId:userEmailId})
       res.send(user)
    }
    catch(err){
        res.status(400).send("there is a error")
    }
})


app.get("/feed",async (req,res) => {
    try{
        const users=await User.find({})
        res.send(users)
    }catch(err){
        res.status(400).send("there is a error")

    }
})

app.get("/userbyid",async(req,res)=>{
    try{
        const user=await User.findById(req.body.ID)
        res.send(user)
    }catch(err){
        res.status(400).send("there is a error")
    }
})


app.delete("/findbyiddelete",async(req,res)=>{
    const userid=req.body.ID
    try{
        const user=await User.findByIdAndDelete(userid,{runValidators:true})
        res.send("user deleted successfully")
    }catch(err){
        res.status(400).send("there is a error")
    }
})


app.put("/findbyidupdate",async(req,res)=>{
    const userid=req.body.ID
    const data=req.body

   
    try{
        const AllowedUpdates=["about","age","gender","photoUrl","ID","password"]
        const isupdateallowed=Object.keys(data).every(k=>AllowedUpdates.includes(k))
    if (!isupdateallowed){
        throw new Error("update is not allowed")
    }

        const user=await User.findByIdAndUpdate(userid,data,{runValidators:true})
        res.send("user updated successfully")
    }
    catch(err){
                res.status(400).send("there is a error :"+err.message)

    }
})

app.put("/findbyemailidupdate",async(req,res)=>{
    const emailid=req.body.emailId
    const data=req.body
    try{
        const user=await User.findOneAndUpdate({emailId:emailid},data,{runValidators:true})
        res.send("user modified successfully")
    }
    catch(err){
        res.status(400).send("there is a error")
    }
})

dbconnect().then(()=>{
    console.log("connection successfull")
    app.listen(3000,()=>{
    console.log("server is successfully running on port 3000")
})
}).catch(err=>console.log(err))

