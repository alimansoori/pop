import express from 'express'
import UserRouter from './routes/users.router'

const app = express()

app.use(express.json())

app.use(UserRouter)

export default app
