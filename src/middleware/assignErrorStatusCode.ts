import { Request, Response, NextFunction } from "express"

export default function assignErrorStatusCode( err: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction): void {
  switch(err.name){
    case "DocumentNotFoundError":
      err.statusCode = 404;
      break;
    case "CastError":
      err.statusCode = 422;
      break;
    case "ValidationError":
      err.statusCode = 422;
      break;
    case "SyntaxError":
      err.statusCode = 400;
      break;
    case "QueryError":
      err.statusCode = 422;
      break;
    default:
      err.statusCode = 500;
  }
  next(err)
}