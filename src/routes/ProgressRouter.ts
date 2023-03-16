import express, { Request, Response, NextFunction } from "express"
import * as controller from "../controllers/ProgressController"
import verifyUserRole from "../middleware/verifyUserRole";

const ALLOWED_ROLES = [
  "ADMIN",
  "DIRECTOR",
  "GUIDE"
]

const router = express.Router();

router.use(verifyUserRole(ALLOWED_ROLES))

//Read all progress
// @@ Permissions: Director, Guide
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  controller.getProgress(req, res, next);
})

//Read one progress
// @@ Permissions: Director, Guide
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  controller.getProgressById(req, res, next);
})

//Update & Delete one progress
// @@ Permissions: Guide
router.post('/:id', verifyUserRole(["ADMIN", "GUIDE"]), (req: Request, res: Response, next: NextFunction) => {
  controller.updateSingleProgress(req, res, next)
})

//Update & Delete many progress
// @@ Permissions: Guide
router.post('/', verifyUserRole(["ADMIN", "GUIDE"]), (req: Request, res: Response, next: NextFunction) => {
  controller.updateManyProgress(req, res, next);
})

export { router as progressRouter };