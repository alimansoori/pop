import app from './app'
import dotenv from 'dotenv'
import sequelize from './config/database'

dotenv.config()

sequelize.sync()

app.listen(process.env.PORT, async () => {
    console.log(`App is running on port ${process.env.PORT}`)
})
