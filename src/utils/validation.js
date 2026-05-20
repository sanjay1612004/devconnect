const validator=require("validator")

const ValidateSignupData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body
    if (!firstName || !lastName){
        throw new Error(":name is not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error(":emailid is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error(":use strong password")
    }
}


const ValidateEditProfileData=(req)=>{
    const allowedEdits=["firstName","lastName","about","gender","photoUrl","Skills","Age"]
    const isEditAllowed=Object.keys(req.body).every((item)=>allowedEdits.includes(item))
    return isEditAllowed
}

const ValidateEditPassword=(req)=>{
    const allowedEdits=["password"]
    const isEditAllowed=Object.keys(req.body).every((item)=>allowedEdits.includes(item))
    return isEditAllowed
}

module.exports={ValidateSignupData,ValidateEditProfileData,ValidateEditPassword}
