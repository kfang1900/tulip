import { db } from "../connect";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req: Request, res: Response) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);

    // CREATE IF USER EXISTS
    if (data.length) return res.status(409).json("User already exists.");

    // CREATE NEW USER
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password);

    const q = "INSERT INTO users (`email`, `password`) VALUE (?)";
    const values = [req.body.email, hashedPassword];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req: Request, res: Response) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);

    // USER FOUND
    if (data.length === 0) return res.status(404).json("User not found.");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password,
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ email: data[0].email }, "secretkey");
    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
