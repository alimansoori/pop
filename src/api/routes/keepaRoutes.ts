import express, { NextFunction, Request, Response } from 'express'
import LeadModel, { ILead } from '../../models/LeadModel'
import { error } from 'shelljs'
import mongoose, { Document, Model, ObjectId, Query } from 'mongoose'
import Keepa from '../../lib/Keepa'
import KeepaApi from '../../lib/KeepaApi'
import ProfitRoiCalculate from '../../lib/ProfitRoiCalculate'
import { generateKeyPair } from 'crypto'

const keepaRoutes = express.Router()

keepaRoutes.post('/', async (req, res, next) => {
    try {
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        const randomIndex = Math.floor(Math.random() * 10)
        const firstLead = await LeadModel.findOne({ 'amazon.updatedAt': { $lt: oneDayAgo } })
            .skip(randomIndex)
            .exec()
        if (firstLead) {
            const asin = firstLead.amazon.asin
            console.log('====================================')
            console.log('ASIN => ' + asin)
            const findAllLeadByAsin = await LeadModel.find({ 'amazon.asin': asin })

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
                if (leadUpdate.source?.price) {
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
                console.log(leadUpdate.toObject())
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
