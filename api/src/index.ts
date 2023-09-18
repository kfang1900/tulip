import express, { Express, Request, Response } from 'express'
import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"
import cors from "cors"
import cookieParser from "cookie-parser"

const app: Express = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)


app.listen(8800, () => {
    console.log("cat")
})
