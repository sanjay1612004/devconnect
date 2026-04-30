const mongoose=require("mongoose")

async function dbconnect() {
   await mongoose.connect("mongodb+srv://sanjaybalajiks_db_user:Sanjay%402004@nodejs.llftuzj.mongodb.net/devConnect")
}
module.exports=dbconnect
