import './db/db'
import dotenv from 'dotenv'
import express from 'express'
const app = express()
dotenv.config()

app.listen(process.env.PORT,() => {
  console.log(`the server is running on the ${process.env.PORT} PORT`)
})