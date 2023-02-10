import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();
const app = express();


const PORT = process.env.PORT || 5000;

//Connect to database
const dbUri = process.env.DATABASE_URI;
if(dbUri){
  mongoose.set('strictQuery', false)
  mongoose.connect(dbUri)
    .catch( err => console.log(`Database connection error: ${err}`))
}else{
  throw Error("Missing (Env)ironment variable")
}
const db = mongoose.connection;
db.on("error", (err: Error) => {
  console.log(`Database error: ${err.message}`)
})
db.once("open", () => {
  console.log("Connected to database...")
})

//Serve Static Assets

//Launch Server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`)
} )

