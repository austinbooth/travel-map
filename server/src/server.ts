import express, { Request, Response, NextFunction } from "express";
const connectDB = require("./db");
import apiRouter from "./routers/api.router";

const app = express();

// connect db
connectDB();

// init middleware
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

app.use("/api", apiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: err.message });
});

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
