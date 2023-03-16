import express, { Request, Response, NextFunction } from "express";
import * as controller from "../controllers/StudentController";
import verifyJWT from "../middleware/verifyJWT";
import verifyUserRole from "../middleware/verifyUserRole";
import { progressRouter } from "./ProgressRouter";

const ALLOWED_ROLES = [
  "ADMIN",
  "DIRECTOR",
  "GUIDE"
]

const router = express.Router();

router.use(verifyJWT)
router.use("/progress", progressRouter) // Role access is different for these routes, so it comes before VerifyRole middleware
router.use(verifyUserRole(ALLOWED_ROLES))

//Read All Students
// @@ Permissions: Director, Guide
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.getStudents(req, res, next);
})

//Create One Student
// @@ Permissions: Director
router.post("/", verifyUserRole(["ADMIN", "DIRECTOR"]), (req: Request, res: Response, next: NextFunction) => {
  controller.createStudent(req, res, next);
})

//Read One Student
// @@ Permissions: Director, Guide
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.getStudentById(req, res, next);
})

//Update One Student
// @@ Permissions: Director
router.patch("/:id", verifyUserRole(["ADMIN", "DIRECTOR"]), (req: Request, res: Response, next: NextFunction) => {
  controller.updateStudent(req, res, next);
})

//Delete One Student
// @@ Permissions: Director
router.delete("/:id", verifyUserRole(["ADMIN", "DIRECTOR"]), (req: Request, res: Response, next: NextFunction) => {
  controller.deleteStudent(req, res, next);
})

export { router as studentRouter };