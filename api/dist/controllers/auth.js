"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const connect_1 = require("../connect");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?";
    connect_1.db.query(q, [req.body.email], (err, data) => {
        if (err)
            return res.status(500).json(err);
        // CREATE IF USER EXISTS
        if (data.length)
            return res.status(409).json("User already exists.");
        // CREATE NEW USER
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(req.body.password);
        const q = "INSERT INTO users (`email`, `password`) VALUE (?)";
        const values = [req.body.email, hashedPassword];
        connect_1.db.query(q, [values], (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    });
};
exports.register = register;
const login = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?";
    connect_1.db.query(q, [req.body.email], (err, data) => {
        if (err)
            return res.status(500).json(err);
        // USER FOUND
        if (data.length === 0)
            return res.status(404).json("User not found.");
        const checkPassword = bcryptjs_1.default.compareSync(req.body.password, data[0].password);
        if (!checkPassword)
            return res.status(400).json("Wrong password or username!");
        const token = jsonwebtoken_1.default.sign({ email: data[0].email }, "secretkey");
        const { password, ...others } = data[0];
        res
            .cookie("accessToken", token, {
            httpOnly: true,
        })
            .status(200)
            .json(others);
    });
};
exports.login = login;
const logout = (req, res) => {
    res
        .clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
    })
        .status(200)
        .json("User has been logged out.");
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map