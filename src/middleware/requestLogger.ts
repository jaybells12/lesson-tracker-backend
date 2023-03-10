import { Request, Response, NextFunction } from "express";

export default function requestLogger(req: Request, res: Response, next: NextFunction): void {
  console.log(`Incoming Req: ${req.method} ${req.url}`)
  next();
}