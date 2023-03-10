import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

export default async function connectDB(): Promise<void> {
  try{
    const DB_URI = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/development' : process.env.DATABASE_URI
    if(!DB_URI) throw new Error("Missing Database URI")
    await mongoose.connect(DB_URI)
  }catch(err){
    console.error(`Database Initial Connection Error: ${err}`)
  }
}