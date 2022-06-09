
async function connectToMongoDb() {

    const mongoose = require("mongoose")
    await mongoose.connect("mongodb://127.0.0.1:27017/scrape")

    console.log('>>>> Connect to MongoDb!')
}

export default connectToMongoDb