import dotenv from 'dotenv';
import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import { studentRouter } from "./routes/StudentRouter"
import { lessonRouter } from './routes/LessonRouter';
import { userRouter } from './routes/UserRouter';
import handleError from './middleware/handleError';
import assignErrorStatusCode from './middleware/assignErrorStatusCode';
import logError from './middleware/logError';

dotenv.config();
const app = express();


const PORT = process.env.PORT || 5000;

//Connect to database
//NEED TO REFACTOR THIS
try{
  const dbUri = "mongodb://localhost:27017/" //process.env.DATABASE_URI;
  if(!dbUri) throw new Error("Missing (Env)ironment variable: Database URI.")
  mongoose.set('strictQuery', false)
  mongoose.connect(dbUri)
}catch(err){
  console.error(`Database Connection Error: ${err}`) 
}
const db = mongoose.connection;
db.on("error", (err: Error) => {
  console.error(`Database Error: ${err}`)
})
db.on("close", () => {
  console.log("Disconnected from database...")
})
db.once("open", () => {
  console.log("Connected to database...")
})

//Serve Static Assets

//Middleware
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  console.log(`Incoming Req: ${req.method} ${req.url}`)
  console.log(Object.keys(req));
  next();
} )

//Routers
app.use('/students', studentRouter);
app.use('/lessons', lessonRouter);
app.use('/users', userRouter);


//Error Handling Middleware
app.use([logError, assignErrorStatusCode, handleError])

//Launch Server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`)
} )



