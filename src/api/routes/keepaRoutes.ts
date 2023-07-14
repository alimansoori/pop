import express from 'express'
import LeadModel from '../../models/LeadModel'
import KeepaApi from '../../lib/KeepaApi'
import ProfitRoiCalculate from '../../lib/ProfitRoiCalculate'

const keepaRoutes = express.Router()

keepaRoutes.post('/', async (req, res, next) => {
    try {
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        const tenDayAgo = new Date()
        tenDayAgo.setDate(tenDayAgo.getDate() - 30)
        const randomIndex = Math.floor(Math.random() * 10)
        const firstLead = await LeadModel.findOne()
            .skip(randomIndex)
            .or([
                {
                    $and: [
                        { 'amazon.updatedAt': { $lt: oneDayAgo } },
                        {
                            $or: [
                                { 'amazon.bsr': { $lt: 400000 } },
                                { 'amazon.bsr': { $exists: false } },
                                { 'amazon.bsr': 0 },
                            ],
                        },
                    ],
                },
                {
                    $and: [
                        { $or: [{ 'amazon.bsr': { $lte: 0 } }, { 'amazon.bsr': { $gt: 400000 } }] },
                        { 'amazon.updatedAt': { $lt: oneDayAgo } },
                    ],
                },
            ])
            .exec()
        if (firstLead) {
            const asin = firstLead.amazon.asin
            console.log('====================================')
            console.log('ASIN => ' + asin)
            const findAllLeadByAsin = await LeadModel.find({ 'amazon.asin': asin })

            try {
                const keepaSearch = new KeepaApi(asin)
                await keepaSearch.fetch()

                for (let i = 0; i < findAllLeadByAsin.length; i++) {
                    const leadUpdate = findAllLeadByAsin[i]
                    leadUpdate.amazon.price = keepaSearch.getSellPrice()
                    leadUpdate.amazon.url = `https://amazon.com/dp/${asin}`
                    if (keepaSearch.amazonProduct?.title) {
                        leadUpdate.amazon.title = keepaSearch.amazonProduct?.title
                    }
                    // Set Profit & ROI
                    if (leadUpdate.source?.price && keepaSearch.getSellPrice() > 0) {
                        const amazonNumber: number = leadUpdate.amazon?.numPack ? leadUpdate.amazon?.numPack : 1
                        const sourceNumber: number = leadUpdate.source?.numPack ? leadUpdate.source?.numPack : 1
                        const numOfPack: number = parseFloat(String(amazonNumber / sourceNumber))

                        const profitROI = new ProfitRoiCalculate({
                            category: keepaSearch.getCategory(),
                            sellPrice: keepaSearch.getSellPrice(),
                            buyCost: leadUpdate.source?.price * numOfPack,
                            packageLength: keepaSearch.amazonProduct?.packageLength
                                ? keepaSearch.amazonProduct?.packageLength
                                : 1,
                            packageHeight: keepaSearch.amazonProduct?.packageHeight
                                ? keepaSearch.amazonProduct?.packageHeight
                                : 1,
                            packageWidth: keepaSearch.amazonProduct?.packageWidth
                                ? keepaSearch.amazonProduct?.packageWidth
                                : 1,
                            packageWeight: keepaSearch.amazonProduct?.packageWeight
                                ? keepaSearch.amazonProduct?.packageWeight
                                : 1,
                        })

                        // Source Update If be lead
                        if (
                            leadUpdate.profit < 5 &&
                            profitROI.netProfit > 5 &&
                            leadUpdate.roi < 30 &&
                            profitROI.roi > 30
                        ) {
                            leadUpdate.source.updatedAt = new Date().toISOString()
                        }

                        leadUpdate.profit = profitROI.netProfit
                        leadUpdate.roi = profitROI.roi
                        leadUpdate.amazon.size = profitROI.size
                    }
                    // Set BSR
                    if (keepaSearch.getBSR()) {
                        leadUpdate.amazon.bsr = keepaSearch.getBSR()
                    }
                    // Set Category
                    if (keepaSearch.getCategory()) {
                        leadUpdate.amazon.category = keepaSearch.getCategory()
                    }
                    //Set UPC
                    if (keepaSearch.amazonProduct?.upcList?.length) {
                        leadUpdate.amazon.upc = keepaSearch.amazonProduct.upcList
                    }
                    //Set Brand
                    if (keepaSearch.amazonProduct?.brand) {
                        leadUpdate.amazon.brand = keepaSearch.amazonProduct.brand
                    }
                    //Set Images
                    if (keepaSearch.getImages().length) {
                        leadUpdate.amazon.images = keepaSearch.getImages()
                    }
                    // Set Seller
                    keepaSearch.amazonProduct?.stats?.buyBoxIsAmazon
                        ? (leadUpdate.amazon.seller = 'Amazon')
                        : (leadUpdate.amazon.seller = '')
                    // Set mSales
                    if (keepaSearch.amazonProduct?.stats?.salesRankDrops30)
                        leadUpdate.amazon.mSales = keepaSearch.amazonProduct?.stats?.salesRankDrops30
                    // Set updatedAt
                    leadUpdate.amazon.updatedAt = new Date().toISOString()

                    await leadUpdate.save()
                    // console.log(leadUpdate.toObject())
                    console.log(`Update success asin: ${asin}`)
                }
            } catch (e: any) {
                for (let i = 0; i < findAllLeadByAsin.length; i++) {
                    const leadUpdate = findAllLeadByAsin[i]
                    leadUpdate.amazon.note = e.message
                    await leadUpdate.save()
                    console.log(`Update failed asin: ${asin} message: ${e.message}`)
                }
            }

            console.log(`Update success ASIN: ${asin}`)
            return res.status(200).json({
                message: `Update success ASIN: ${asin}`,
                data: firstLead.toObject(),
                sames: findAllLeadByAsin,
            })
        }

        console.log('Lead for update not exist!')

        return res.status(200).json({
            message: 'Lead for update not exist!',
        })
    } catch (e: any) {
        console.log(e.message)
        res.status(200).json({
            message: e.message,
        })
    }
})

export default keepaRoutes
