import { Model, STRING } from 'sequelize'
import sequelize from '../config/database'

class User extends Model {
    declare username: string
    declare email: string
    declare password: string
}

User.init(
    {
        username: {
            type: STRING,
        },
        email: {
            type: STRING,
        },
        password: {
            type: STRING,
        },
    },
    {
        sequelize,
        modelName: 'usersss',
        freezeTableName: true,
    }
)

export default User
