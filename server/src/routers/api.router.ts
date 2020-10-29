import { Router } from "express";
const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("API route"));

export default apiRouter;
