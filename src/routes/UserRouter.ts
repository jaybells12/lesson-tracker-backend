import express, { Request, Response, NextFunction } from "express";
import * as controller from "../controllers/UserController"
import verifyJWT from "../middleware/verifyJWT";
import verifyUserRole from "../middleware/verifyUserRole";

const ALLOWED_ROLES = [
  "ADMIN",
  "DIRECTOR",
]

const router = express.Router();

router.use(verifyJWT)
router.use(verifyUserRole(ALLOWED_ROLES))

//Read All Users
// @@ Permissions: Directors can see all Guides, Parents
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.getUsers(req, res, next);
})

//Create One User
// @@ Permissions: Directors can create Guides / Parents
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  controller.createUser(req, res, next);
})

//Read One User
// @@ Permissions: Directors can see all Guides, Parents
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.getUserById(req, res, next);
})

//Update One User
// @@ Permissions: Directors can update all Guides, Parents
router.patch("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.updateUser(req, res, next);
})

//Delete One User
// @@ Permissions: Directors can delete all Guides, Parents
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.deleteUser(req, res, next);
})

export { router as userRouter };