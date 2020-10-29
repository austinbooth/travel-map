"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiRouter = express_1.Router();
apiRouter.get("/", (req, res) => res.send("API route"));
exports.default = apiRouter;
