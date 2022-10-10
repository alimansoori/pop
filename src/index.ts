import app from './app'
import dotenv from 'dotenv'
import sequelize from './config/database'

dotenv.config()

if (process.env.NODE_ENV === 'development') {
    sequelize
        .sync({
            logging: console.log,
            force: true,
        })
        .then(() => {
            console.log('Connection to database successfully')
            app.listen(process.env.PORT, async () => {
                console.log(`App is running on port ${process.env.PORT}`)
            })
        })
        .catch((err) => {
            console.log('Connection to database failed: ' + err)
        })
} else {
    app.listen(process.env.PORT, async () => {
        console.log(`App is running on port ${process.env.PORT}`)
    })
}
