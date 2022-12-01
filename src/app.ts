import express from 'express'
import UserRouter from './routes/users.router'
import AmazonRouter from './routes/amazon.router'
import SourceRouter from './routes/source.router'
import LeadRouter from './routes/lead.router'

const app = express()

app.use(express.json())

/*app.use(UserRouter)
app.use(AmazonRouter)
app.use(SourceRouter)
app.use(LeadRouter)*/

export default app
