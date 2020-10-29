"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    trip: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    photos: [
        {
            image_url: {
                type: String,
                required: true,
            },
            desc: {
                type: String,
            },
        },
    ],
});
const Post = mongoose_1.default.model("post", postSchema);
exports.default = Post;
