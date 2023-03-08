import express, { Request, Response, NextFunction } from 'express';
import * as controller from "../controllers/StudentController"

const router = express.Router();

//Read All Students
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.getStudents(req, res, next);
})

//Create One Student
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  controller.createStudent(req, res, next);
})

//Read One Student
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.getStudentById(req, res, next);
})

//Update One Student
router.patch("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.updateStudent(req, res, next);
})

//Delete One Student
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  controller.deleteStudent(req, res, next);
})

export { router as studentRouter };