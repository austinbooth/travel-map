"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = __importDefault(require("./user.router"));
const apiRouter = express_1.Router();
apiRouter.get("/", (req, res) => res.send("This is the API route"));
apiRouter.use("/user", user_router_1.default);
exports.default = apiRouter;
