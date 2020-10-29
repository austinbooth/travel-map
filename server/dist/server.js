"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const connectDB = require('./config/db');
const api_router_1 = __importDefault(require("./routers/api.router"));
const app = express_1.default();
// connect db
// connectDB();
// init middleware
app.use(express_1.default.json());
app.get("/", (req, res) => res.send("API running"));
app.use("/api", api_router_1.default);
app.use((err, req, res, next) => {
    res.json({ msg: err.message });
});
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
