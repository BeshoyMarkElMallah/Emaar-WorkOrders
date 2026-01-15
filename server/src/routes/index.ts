import { Router } from "express";
import orderRoutes from "./orderRoutes";

const rootRouter: Router = Router();

rootRouter.use("/orders", orderRoutes);



export default rootRouter;