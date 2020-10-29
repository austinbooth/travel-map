"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const token_1 = require("./token");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(token_1.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("MongoDB connected...");
    }
    catch (err) {
        console.log(err.message);
        // exit process with failure
        process.exit(1);
    }
};
module.exports = connectDB;
