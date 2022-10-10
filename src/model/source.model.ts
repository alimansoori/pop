import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Source extends Model {
    declare id: number
    declare title: string
    declare url: string
}

Source.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(500),
        },
        price: {
            type: DataTypes.INTEGER,
        },
        inStock: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
    }
)

export default Source
