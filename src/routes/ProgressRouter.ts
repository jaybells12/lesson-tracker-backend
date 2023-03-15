import express, { Request, Response, NextFunction } from "express"
import * as controller from "../controllers/ProgressController"
import { IRoles } from "../interfaces/Controller-Interfaces";
import verifyUserRole from "../middleware/verifyUserRole";

const ALLOWED_ROLES: IRoles[] = [
  "ADMIN",
  "GUIDE"
]

const router = express.Router();

router.use(verifyUserRole(ALLOWED_ROLES))

//Read all progress
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  controller.getProgress(req, res, next);
})

//Read one progress
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  controller.getProgressById(req, res, next);
})

//Update & Delete one progress
router.post('/:id', (req: Request, res: Response, next: NextFunction) => {
  controller.updateSingleProgress(req, res, next)
})

//Update & Delete many progress
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  controller.updateManyProgress(req, res, next);
})

export { router as progressRouter };