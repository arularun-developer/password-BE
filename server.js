import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from "./Database/dbconfig.js"
import userRouter from './routes/authroutes.js'
dotenv.config()

const PORT = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())  
app.use("/user",userRouter)

connectDB();

app.listen(PORT, () => {
    console.log("app is listening with port =>", PORT);
})