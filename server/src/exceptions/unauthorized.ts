import { HttpException } from "./root";

export class UnauthorizedException extends HttpException{
    constructor(message:string,errorCode:string,errors?:any){
        super(message,errorCode,401,errors)
    }
}