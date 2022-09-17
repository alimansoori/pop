import express from 'express'
import path from 'path'
import expressLayouts from 'express-ejs-layouts'
import dotenv from 'dotenv'
import * as routes from './routes'

dotenv.config()

const app = express()

// setup layouts
app.use(expressLayouts)
app.set('layout', 'layouts/layout')
// setting view engin
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

routes.register(app)

app.listen(process.env.PORT, async () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})

export default app
