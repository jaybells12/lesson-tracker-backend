import { Request, Response, NextFunction } from "express"

export default function handleError(err: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction): void {
  const resStatus = err.statusCode || 500;
  const errName = err.name || "ServerError"
  const errMsg = err.message || "Something went wrong."
  res.status(resStatus).json({
    success: false,
    status: resStatus,
    name: errName,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  })
}