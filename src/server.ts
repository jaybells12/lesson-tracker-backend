import dotenv from "dotenv";
import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import connectDB from "./config/connectDB";
import { USER_ROLES } from "./config/userRoles";
import { studentRouter } from "./routes/StudentRouter"
import { lessonRouter } from "./routes/LessonRouter";
import { userRouter } from "./routes/UserRouter";
import requestLogger from "./middleware/requestLogger";
import handleError from "./middleware/handleError";
import assignErrorStatusCode from "./middleware/assignErrorStatusCode";
import logError from "./middleware/logError";
import { handleLogin, handleLogout, handleRefresh } from "./controllers/AuthController";
import verifyJWT from "./middleware/verifyJWT";
import CustomError from "./utilities/CustomError";
import cookieParser from "cookie-parser";

/*
* STORIES -- Is this only an API server? or is it going to build and serve content to the browser?
* @ create generic 404 route
* @ create student progress related routes
* @ create auth related routes or auth router (login/logout/refresh)
* @ create verify role middleware
* @ assign role verification to routes (need to figure out which routes are available to which roles)
* @ look into email validation options
* @ expand and test custom error handling
* @ Using ReferenceError for missing values, need to add and change everywhere (verify error messaging and naming convention is consistent)
* @ service workers for controller functions?
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

// Routes
app.post('/login', handleLogin);
// Login Page GET
app.get('/test', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
  if(!('username' in req) || !('role' in req)) return next(new CustomError("Missing expected request property.", "ReferenceError"))
  return res.status(200).json({success: true, message: "AUTHORIZED!", username: req.username, role: req.role})
})
app.get('/refresh', handleRefresh)
app.get('/logout', handleLogout)
// Login Action POST? Verify User Exists and Passwords Match, create JWT, refresh token?
// Register Page (Endpoint is createUser route)

//Routers
app.use('/students', studentRouter);
app.use('/lessons', lessonRouter);
app.use('/users', userRouter);


//Error Handling Middleware
app.use([logError, assignErrorStatusCode, handleError])

//404 General Not Found Page

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