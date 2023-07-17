import app from './app'
import leadRoutes from './api/routes/leadsRoutes'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import config from './config/config'
import keepaRoutes from './api/routes/keepaRoutes'
import sourceRoutes from './api/routes/sourceRoutes'

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/1.0/leads', leadRoutes)
app.use('/api/1.0/keepa', keepaRoutes)
app.use('/api/1.0/source', sourceRoutes)

mongoose
    .connect('mongodb://162.223.91.117:27017/oa', {
        // .connect(config.mongo_server, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDb Connection successful')
        app.listen(3000)
    })
    .then((res) => {
        console.log(`Server is running on port ${3000}`)
    })
