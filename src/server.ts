import dotenv from "dotenv";
import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import connectDB from "./config/connectDB";
import { studentRouter } from "./routes/StudentRouter"
import { lessonRouter } from "./routes/LessonRouter";
import { userRouter } from "./routes/UserRouter";
import { authRouter } from "./routes/AuthRouter";
import requestLogger from "./middleware/requestLogger";
import handleError from "./middleware/handleError";
import assignErrorStatusCode from "./middleware/assignErrorStatusCode";
import logError from "./middleware/logError";
import CustomError from "./utilities/CustomError";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/verifyJWT";
import verifyUserRole from "./middleware/verifyUserRole";

/*
* STORIES -- Is this only an API server? or is it going to build and serve content to the browser?
* x create generic 404 route 
* x create student progress related routes
* x create auth related routes or auth router (login/logout) (Auto refreshing handled in front end)
* x create verify role middleware, allowed user role is stored in AT payload.
* x assign role verification to routes (need to figure out which routes are available to which roles)
* @ ^^ role route protections needs to be refined, but has a basic setup
* @ Need to implement Role assignment controls, currently done manually at User creation endpoint
* @ ^^ Role assignment needs to be role protected. Admins > Everything, Directors > Guides, Parents (maybe guides can create parent users later on in new version)
* x verify custom error messaging and naming conventions are consistent
* @ service workers for controller functions?
* @ look into email validation options
* @ TESTING TESTING TESTING
*/

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Connect to database
connectDB();

//Serve Static Assets

//Middleware
app.use(express.json())
app.use(cookieParser())
app.all('*', requestLogger)

//Routes
app.use('/auth', authRouter) // Login - Logout - Refresh
app.use('/students', studentRouter); // Standard CRUD + Progress Routes
app.use('/lessons', lessonRouter); // Standard CRUD
app.use('/users', userRouter); // Standard CRUD

//Testing Route
app.get('/test', verifyJWT, verifyUserRole(['ADMIN']), (req, res) => {
  res.status(200).json({
    success: true,
    user: ('username' in req) ? req.username : null,
    role: ('role' in req) ? req.role : null,
  })
})

//Error Handling Middleware
app.use([logError, assignErrorStatusCode, handleError])

//404 General Not Found Page
app.use( (req, res) => {
  return res.sendStatus(404);
})

//Launch Server
mongoose.connection.once("open", () => {
  console.log("Connected to database...")
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`)
  })
})
mongoose.connection.on("error", (err: Error) => {
  console.error(`Database Error: ${err}`)
})
mongoose.connection.on("close", () => {
  console.log("Disconnected from database...")
})