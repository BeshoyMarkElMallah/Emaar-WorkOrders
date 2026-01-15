import { HttpException } from "./root";

export class UnprocessableEntity extends HttpException {
    constructor(error: any, message: string, errorCode: string,) {
        super(message, errorCode, 422, error);
    }
}