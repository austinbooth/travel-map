"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.userValidation = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../token");
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
// route    POST api/user
// desc     Register (create) user
// access   Public
exports.userValidation = [
    express_validator_1.check("firstname", "Firstname is required").not().isEmpty(),
    express_validator_1.check("lastname", "Lastname is required").not().isEmpty(),
    express_validator_1.check("email", "Please include a valid email address").isEmail(),
    express_validator_1.check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
];
exports.registerUser = async (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, email, password } = req.body;
    try {
        let user = await user_model_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }
        user = new user_model_1.default({
            firstname,
            lastname,
            email,
            password,
        });
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, token_1.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error :(");
    }
};
