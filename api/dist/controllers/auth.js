"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const connect_1 = require("../connect");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = (req, res) => {
    // CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE id = ?";
    connect_1.db.query(q, [req.body.id], (err, data) => {
        if (err)
            return res.status(500).json(err);
        // CREATE A NEW USER
        if (data.length)
            return res.status(409).json("User already exists.");
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(req.body.password);
        const q = "INSERT INTO users (`firstName`, `lastName`, `email`, `password`) VALUE (?)";
        const values = [req.body.firstName, req.body.lastName, req.body.email, hashedPassword];
        connect_1.db.query(q, [values], (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    });
};
exports.register = register;
const login = (req, res) => {
    // TODO
};
exports.login = login;
const logout = (req, res) => {
    // TODO
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map