import { Request, Response, NextFunction } from "express"

export default function assignErrorStatusCode( err: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction): void {
  switch(err.name){
    case "ReferenceError":
      err.statusCode = 400;
      break;
    case "PayloadError":
    case "AuthError":
    case "TokenExpiredError":
    case "JsonWebTokenError":
      err.statusCode = 401;
      break;
    case "PermissionError":
      err.statusCode = 403;
      break;
    case "DocumentNotFoundError":
      err.statusCode = 404;
      break;
    case "CastError":
    case "ValidationError":
    case "ValidatorError":
    case "TypeError":
      err.statusCode = 422;
      break;
    case "EnvError":
      err.statusCode = 500;
      break;
    default:
      err.statusCode = 500;
  }
  next(err)
}