import express, { Request, Response, NextFunction } from "express";
import * as controller from "../controllers/AuthController"

const router = express.Router();

//Login User
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  controller.handleLogin(req, res, next);
})

//Logout User
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  controller.handleLogout(req, res, next);
})

//Get refresh token
router.get("/refresh", (req: Request, res: Response, next: NextFunction) => {
  controller.handleRefresh(req, res, next);
})

export { router as authRouter };