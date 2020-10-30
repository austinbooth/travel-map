import { Router } from "express";
import userRouter from "./user.router";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("This is the API route"));
apiRouter.use("/user", userRouter);

export default apiRouter;
