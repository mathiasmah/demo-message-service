import { Request, Response, NextFunction } from "express";

export function logging(req: Request, res: Response, next: NextFunction) {
    console.info("received request : "+req.method+" "+req.originalUrl );
    next();
  };