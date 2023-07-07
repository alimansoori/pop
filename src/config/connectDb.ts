import mongoose from 'mongoose'
import config from './config'

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongo_server, {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Success Connect to DB')
    } catch (error) {
        console.error('Error Connect to DB', error)
    }
}

export default connectDB
