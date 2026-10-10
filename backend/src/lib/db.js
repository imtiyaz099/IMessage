import mongoose from "mongoose";

export async function connectDB(){
    try{
        const mongoUri = process.env.DB_URL;
        console.log(mongoUri)

        if(!mongoUri){
            throw new Error("MONGO_URI is required");
        } 
        
        mongoose.connect(process.env.DB_URL);
        console.log("MongoDB Connected Successfully");
    }
    catch(e){
        console.log("Connection Error : ",e.message);;
        // process.exit(1);  1--> failure , 0 --> sucess
    }
}

// export default connectDB;