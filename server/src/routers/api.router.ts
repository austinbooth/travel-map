import { Router } from "express";
const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("This is the API route"));

export default apiRouter;
