// import { NextFunction, Request, Response } from "express";
// import { UnauthorizedException } from "../exceptions/unauthorized";
// import { ErrorCodes } from "../exceptions/root";
// import * as jwt from 'jsonwebtoken';
// import { JWT_SECRET } from "../secrets";
// import { prismaClient } from "..";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: number;
//         role: string;
//       };
//     }
//   }
// }

// const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   // 1. get the token from the header
//   const token =
//     (typeof req.headers.Authorization === "string" ? req.headers.Authorization.split(" ")[1] : undefined) ||
//     (typeof req.headers.authorization === "string" ? req.headers.authorization.split(" ")[1] : undefined);
//   // 2. if there is no token throw unAuthorized Exception
//   if (!token) {
//     return next(new UnauthorizedException("UnAuthorized", ErrorCodes.UNAUTHORIZED));
//   }
//   try {
//     // 3. if there is token, verify it and extract the payload
//     const payload: { id: number } = jwt.verify(token as string, JWT_SECRET) as any

//     // 4. get user from payload
//     const user = await prismaClient.user.findFirst({ where: { id: payload.id } });
//     console.log(
//       "user from payload",
//       user
//     );

//     if (!user) {
//       return next(new UnauthorizedException("UnAuthorized", ErrorCodes.UNAUTHORIZED));
//     }

//     // 5. attach the user to current request object
//     (req as any).user = user;
//     return next();
//     // next();
//   } catch (error) {
//     return next(new UnauthorizedException("UnAuthorized", ErrorCodes.UNAUTHORIZED));
//   }


// }

// export default authMiddleware;