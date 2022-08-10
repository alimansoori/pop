import {database} from "../lib/config/database";
import {Model} from "sequelize";

class AmazonModel extends Model {
}

AmazonModel.sync()
export default AmazonModel