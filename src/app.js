const express=require("express")

const app=express()

app.use("/test",(req,res)=>{
    res.send("server is running")
})

app.use("/hello",(req,res)=>{
    res.send("hello from hello")
})

app.use("/hai",(req,res)=>{
    res.send("hai from hello")
})

app.listen(3000,()=>{
    console.log("server is successfully running on port 3000")
})