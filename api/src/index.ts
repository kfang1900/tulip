import express, { Express, Request, Response } from 'express'
import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"

const app: Express = express()

// middlewares
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)


app.listen(8800, () => {
    console.log("cat")
})
