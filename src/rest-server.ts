import app from './app'
import leadRoutes from './api/routes/leadsRoutes'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import config from './config/config'

const port = 4000

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
})*/

app.use('/api/1.0/leads', leadRoutes)

mongoose
    .connect(config.mongo_server, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDb Connection successful')
        app.listen(port)
    })
    .then((res) => {
        console.log(`Server is running on port ${port}`)
    })
