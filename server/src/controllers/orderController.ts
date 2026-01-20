import { Request, Response, NextFunction } from "express";

import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { dbService } from "../database/service";
import { Orders, TotalOrders } from "../../types/orders";

// export const createOrder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const {
//     } = req.body;


//     // Include power persons in the response
//     res.status(201).json({
//       message: "Order created successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;


    const total = await dbService.executeQuery<TotalOrders>(
      `SELECT COUNT(*)  AS Total FROM tickets
        WHERE action = 'Generated'  AND CURRENT_TIMESTAMP >  endTime
      `
    );

    if (page > Math.ceil(Number(total[0].Total) / pageSize)) {
      page = 1;
    }

    const skip = (page - 1) * pageSize;


    const orders = await dbService.executeQuery<Orders>(
      `SELECT * FROM tickets
      WHERE action = 'Generated'  AND CURRENT_TIMESTAMP >  endTime
      ORDER BY generated_at DESC
      OFFSET ${skip} ROWS FETCH NEXT ${pageSize} ROWS ONLY`
    );

    // console.log(orders);


    // console.log("orders result:", JSON.stringify(orders, null, 2));

    if (!orders) {
      throw new NotFoundException("Orders Not Found!", ErrorCodes.NOT_FOUND);
    }


    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      pagination: {
        page,
        pageSize,
        total: total[0].Total,
        totalPages: Math.ceil(Number(total[0].Total) / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};








// export const getOrdersByFilter = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { status, userId, isCompleted, type, goStartDate } = req.query;
//     const page = parseInt(req.query.page as string) || 1;
//     const pageSize = parseInt(req.query.pageSize as string) || 10;
//     const skip = (page - 1) * pageSize;

//     const where: any = {};
//     if (status) {
//       if (status === "rejected") {
//         where.status = { startsWith: "rejected" };
//       } else if (status === "approved") {
//         where.status = { startsWith: "approved" };
//       } else {
//         if (type) {
//           where.status = `${status}_${type}`;
//         } else {
//           where.status = status;
//         }
//       }
//     }
//     if (userId) {
//       where.userId = parseInt(userId as string);
//     }
//     if (isCompleted === "true") {
//       where.isCompleted = true;
//     } else if (isCompleted === "false") {
//       where.isCompleted = false;
//     }
//     if (goStartDate) {
//       where.goStartDate = goStartDate;
//     }
//     const [orders, total] = await Promise.all([
//       prismaClient.order.findMany({
//         skip,
//         take: pageSize,
//         where,
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           user: {
//             include: {
//               rank: true,
//               wehda: true,
//             },
//           },
//           approvals: {
//             include: {
//               manager: true,
//             },
//           },
//           car: {
//             include: {
//               Driver: {
//                 include: {
//                   driverRank: true,
//                 },
//               },
//             },
//           },
//           ka2ed: {
//             include: {
//               rank: true,
//             },
//           },
//           weapons: true,
//           WeaponAmo: true,
//           powerPerson: true,
//         },
//       }),
//       prismaClient.order.count({ where }),
//     ]);

//     if (!orders) {
//       throw new NotFoundException("Order Not Found!", ErrorCodes.NOT_FOUND);
//     }
//     res.status(200).json({
//       orders,
//       pagination: {
//         page,
//         pageSize,
//         total,
//         totalPages: Math.ceil(total / pageSize),
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
