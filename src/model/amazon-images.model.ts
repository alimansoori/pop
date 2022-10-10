import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class AmazonImages extends Model {}

AmazonImages.init(
    {
        src: {
            type: DataTypes.STRING(500),
        },
    },
    {
        sequelize,
        modelName: 'amazon_images',
        freezeTableName: true,
        timestamps: false,
    }
)

export default AmazonImages
