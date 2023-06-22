import app from './app'
import dotenv from 'dotenv'

dotenv.config()

// const uri = `mongodb://${config.mongo_username}:${config.mongo_password}@${config.mongo_host}:${config.mongo_port}/${config.mongo_db}`

app.listen(process.env.PORT, async () => {
    /*try {
        await mongoose.connect(uri)
        console.log('Connected to MongoDB')
    } catch (e: any) {
        console.error('Failed to connect to MongoDB', e.message)
    }*/
    console.log(`App is running on port ${process.env.PORT}`)
})
