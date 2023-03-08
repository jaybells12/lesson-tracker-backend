import { Request, Response, NextFunction } from "express"

export default function logError(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(`ERROR: ${err.name}: ${err.message}`)
  next(err)
}