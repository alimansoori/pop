import app from './app'
import dotenv from 'dotenv'
import connectDB from './config/connectDb'

dotenv.config()

console.log('ENV => ' + process.env.NODE_ENV)

app.listen(process.env.PORT, async () => {
    /*if (process.env.NODE_ENV === 'development') {
        await connectDB()
    }*/
    console.log(`App is running on port ${process.env.PORT}`)
})
