"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiRouter = express_1.Router();
apiRouter.get("/", (req, res) => res.send("This is the API route"));
exports.default = apiRouter;
