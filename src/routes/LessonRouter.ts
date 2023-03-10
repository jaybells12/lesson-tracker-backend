import express, { Request, Response, NextFunction } from "express";
import * as controller from "../controllers/LessonController"
import verifyJWT from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT)

//Read All Lessons
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.getLessons(req, res, next);
})

//Create One Lesson
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  controller.createLesson(req, res, next);
})

//Read One Lesson
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.getLessonById(req, res, next);
})

//Update One Lesson
router.patch("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.updateLesson(req, res, next);
})

//Delete One Lesson
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.deleteLesson(req, res, next);
})

export { router as lessonRouter };