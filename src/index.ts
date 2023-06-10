import app from './app'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import config from './config/config'

dotenv.config()

/*if (process.env.NODE_ENV === 'development') {
    sequelize
        .sync({
            logging: console.log,
            force: true,
        })
        .then(() => {
            console.log('Connection to database successfully')
        })
        .catch((err) => {
            console.log('Connection to database failed: ' + err)
        })
    app.listen(process.env.PORT, async () => {
        console.log(`App is running on port ${process.env.PORT}`)
    })
}*/

const uri = `mongodb://${config.mongo_username}:${config.mongo_password}@${config.mongo_host}:${config.mongo_port}/${config.mongo_db}`

app.listen(process.env.PORT, async () => {
    /*try {
        await mongoose.connect(uri)
        console.log('Connected to MongoDB')
    } catch (e: any) {
        console.error('Failed to connect to MongoDB', e.message)
    }*/
    console.log(`App is running on port ${process.env.PORT}`)
})
