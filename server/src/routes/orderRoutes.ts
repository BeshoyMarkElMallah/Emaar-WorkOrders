import { Router } from "express";
// import authMiddleware from "../middlewares/auth";
import {
  getAllOrders,
} from "../controllers/orderController";
import { errorHandler } from "../error-handler";

const orderRoutes: Router = Router();


orderRoutes.get("/", errorHandler(getAllOrders));

export default orderRoutes;
