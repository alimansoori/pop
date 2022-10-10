import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import Amazon from './amazon.model'
import Source from './source.model'

class Lead extends Model {}

Lead.init(
    {
        net: {
            type: DataTypes.FLOAT,
        },
        roi: {
            type: DataTypes.INTEGER,
        },
        isMatch: {
            type: DataTypes.BOOLEAN,
        },
        dateNet: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
    }
)

Amazon.belongsToMany(Source, { through: Lead })
Source.belongsToMany(Amazon, { through: Lead })

export default Lead
