import { Router } from "express";
import { userValidation, registerUser } from "../controllers/user.controller";

const userRouter = Router().post("/", userValidation, registerUser);

export default userRouter;
