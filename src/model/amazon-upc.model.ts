import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class AmazonUPC extends Model {}

AmazonUPC.init(
    {
        upc: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'amazon_upc',
        freezeTableName: true,
        timestamps: false,
    }
)

export default AmazonUPC
