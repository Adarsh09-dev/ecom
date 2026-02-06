import mongoose from "mongoose";
import  dotenv  from "dotenv";
dotenv.config();

     if(!process.env.MONGODB_URI){
    throw new Error("MONGODB URI is Missing")
 }
   async function connectDB() {

    try{
            await mongoose.connect(process.env.MONGODB_URI)
            console.log('connect DB');
    } catch(err) {

    
        console.log('mongoDB connection error',err)
        process.exit(1);
    }
    
   } 

 
export default connectDB;
