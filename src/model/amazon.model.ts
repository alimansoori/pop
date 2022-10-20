import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import AmazonDetail from './amazon-detail.model'
import AmazonUPC from './amazon-upc.model'
import AmazonImages from './amazon-images.model'

class Amazon extends Model {
    declare id: number
    declare title: string
    declare url: string
}

Amazon.init(
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
        asin: {
            type: DataTypes.STRING(10),
        },
        url: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING(500),
        },
        category: {
            type: DataTypes.STRING(100),
        },
        price: {
            type: DataTypes.FLOAT,
        },
    },
    {
        sequelize,
    }
)

// Amazon.hasOne(AmazonDetail)
// AmazonDetail.belongsTo(Amazon)
// Amazon.hasMany(AmazonUPC)
// Amazon.hasMany(AmazonImages)

export default Amazon
