import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class AmazonDetail extends Model {}

AmazonDetail.init(
    {
        bsr: {
            type: DataTypes.INTEGER,
        },
        monthlySales: {
            type: DataTypes.INTEGER,
        },
        brand: {
            type: DataTypes.STRING,
        },
        mfr: {
            type: DataTypes.STRING,
        },
        seller: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.ENUM,
            values: ['sm Standard', 'lg Standard', 'sm Oversize', 'lg Oversize'],
        },
        weight: {
            type: DataTypes.FLOAT,
        },
    },
    {
        sequelize,
        modelName: 'amazon_details',
        freezeTableName: true,
        timestamps: false,
    }
)

export default AmazonDetail
