import express, { Request, Response, NextFunction } from "express";
import * as controller from "../controllers/LessonController"
import verifyJWT from "../middleware/verifyJWT";
import verifyUserRole from "../middleware/verifyUserRole";

const ALLOWED_ROLES = [
  "ADMIN",
  "DIRECTOR",
  "GUIDE"
]

const router = express.Router();

router.use(verifyJWT)
router.use(verifyUserRole(ALLOWED_ROLES))

//Read All Lessons
// @@ Permissions: Director, Guide
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.getLessons(req, res, next);
})

//Create One Lesson
// @@ Permissions: Guide
router.post("/", verifyUserRole(["ADMIN", "GUIDE"]), (req: Request, res: Response, next: NextFunction) => {
  controller.createLesson(req, res, next);
})

//Read One Lesson
// @@ Permissions: Director, Guide
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.getLessonById(req, res, next);
})

//Update One Lesson
// @@ Permissions: Guide
router.patch("/:id", verifyUserRole(["ADMIN", "GUIDE"]), (req: Request, res: Response, next: NextFunction) => {
  controller.updateLesson(req, res, next);
})

//Delete One Lesson
// @@ Permissions: Guide
router.delete("/:id", verifyUserRole(["ADMIN", "GUIDE"]), (req: Request, res: Response, next: NextFunction) => {
  controller.deleteLesson(req, res, next);
})

export { router as lessonRouter };