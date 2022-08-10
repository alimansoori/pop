import {Sequelize} from "sequelize"

export const database = new Sequelize('fba', 'root', 'Ali.1234!@#$', {
    host: '162.223.91.116',
    dialect: 'mysql'
});