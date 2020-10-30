"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.Router().post("/", user_controller_1.userValidation, user_controller_1.registerUser);
exports.default = userRouter;
