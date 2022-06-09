import mongoose from "mongoose"

const listingSchema = new mongoose.Schema({
    title: String,
    date: Date,
    url: String,
    price: Number,
    amzTitle: String,
    amzUrl: String,
    amzPrice: Number,
    netProfit: Number
})

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing