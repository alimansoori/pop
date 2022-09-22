import { Sequelize } from 'sequelize'
import config from 'config'

// @ts-ignore
const dbConfig: config = config.get('database')

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
})

export default sequelize
