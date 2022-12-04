import express from 'express'

const app = express()

app.use(express.json())

/*app.use(UserRouter)
app.use(AmazonRouter)
app.use(SourceRouter)
app.use(LeadRouter)*/

export default app
