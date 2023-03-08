import express, { Request, Response, NextFunction } from "express";
import * as controller from "../controllers/UserController"

const router = express.Router();

//Read All Users
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.getUsers(req, res, next);
})

//Create One User
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  controller.createUser(req, res, next);
})

//Read One User
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.getUserById(req, res, next);
})

//Update One User
router.patch("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.updateUser(req, res, next);
})

//Delete One User
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.deleteUser(req, res, next);
})

export { router as userRouter };