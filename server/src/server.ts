import express from "express";
// const connectDB = require('./config/db');
import apiRouter from "./routers/api.router";

const app = express();

// connect db
// connectDB();

// init middleware
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

app.use("/api", apiRouter);

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
