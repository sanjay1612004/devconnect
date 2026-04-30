const auth=(req,res,next)=>{
    const token="xyz"
    const auth=token==="xyz"
    if (!auth){
        res.send("you are not allowed")
    }
    else{
        next()
    }
}

module.exports={auth}