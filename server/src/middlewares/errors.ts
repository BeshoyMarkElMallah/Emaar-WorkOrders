import { NextFunction,Request,Response } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (error:HttpException, req:Request, res:Response, next:NextFunction) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
  
    res.status(statusCode).json({
        message: message,
        errorCode: error.errorCode,
        errors:error.errors
    })

}