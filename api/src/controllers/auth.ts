import { db } from "../connect"
import { Request, Response } from "express"
import bcrypt from "bcryptjs"

export const register = (req: Request, res: Response) => {
    
    // CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE id = ?"

    db.query(q, [req.body.id], (err, data) => {
        if (err) return res.status(500).json(err)

        // CREATE A NEW USER
        if (data.length) return res.status(409).json("User already exists.")
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password)

            const q = "INSERT INTO users (`firstName`, `lastName`, `email`, `password`) VALUE (?)"
            const values = [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]

            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err)
                return res.status(200).json("User has been created.")
            })
        })

    }


export const login = (req: Request, res: Response) => {
    // TODO
}

export const logout = (req: Request, res: Response) => {
    // TODO
}