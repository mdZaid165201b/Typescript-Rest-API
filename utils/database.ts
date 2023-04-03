import mongoose from "mongoose";
import { config } from "dotenv";

config();


export const connect = async(): Promise<void> => {
    try{
        await mongoose.connect(process.env.DATABASE_URI as string, );
        console.log("Database Connected successfully!!!");
    }
    catch (error){
        console.log("database connection error :",error)
    }
}