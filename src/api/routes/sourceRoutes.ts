import express, { NextFunction, Request, Response } from 'express'
import LeadModel, { ILead } from '../../models/LeadModel'
import { error } from 'shelljs'
import mongoose, { Document, Model, ObjectId, Query } from 'mongoose'
import Keepa from '../../lib/Keepa'
import KeepaApi from '../../lib/KeepaApi'
import ProfitRoiCalculate from '../../lib/ProfitRoiCalculate'
import { generateKeyPair } from 'crypto'
import { EnumCategories } from '../../@types/EnumCategories'
import DatabaseLeads from '../../sheets/DatabaseLeads'

const sourceRoutes = express.Router()

sourceRoutes.get('/', async (req, res, next) => {
    try {
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        const randomIndex = Math.floor(Math.random() * 40)

        // Rand 1 & -1
        const randomNumber = Math.random()
        const randomSign = randomNumber < 0.5 ? -1 : 1

        const firstLead = await LeadModel.findOne({
            'source.updatedAt': { $lt: oneDayAgo },
            status: { $ne: 'mis_match' },
        })
            .sort({ createdAt: randomSign })
            .or([
                {
                    $and: [
                        { 'amazon.category': EnumCategories.TOYS },
                        { 'amazon.bsr': { $lt: 312000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.SPORT },
                        { 'amazon.bsr': { $lt: 350000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.PET },
                        { 'amazon.bsr': { $lt: 150000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.ART },
                        { 'amazon.bsr': { $lt: 250000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.PATIO },
                        { 'amazon.bsr': { $lt: 300000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.HOME_KITCHEN },
                        { 'amazon.bsr': { $lt: 300000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.VIDEO_GAMES },
                        { 'amazon.bsr': { $lt: 30000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.INDUSTRIAL },
                        { 'amazon.bsr': { $lt: 250000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.TOOLS },
                        { 'amazon.bsr': { $lt: 300000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.OFFICE_PRODUCTS },
                        { 'amazon.bsr': { $lt: 240000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.GROCERY },
                        { 'amazon.bsr': { $lt: 150000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.ELECTRONIC },
                        { 'amazon.bsr': { $lt: 200000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.CAMERA },
                        { 'amazon.bsr': { $lt: 35000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.BEAUTY },
                        { 'amazon.bsr': { $lt: 32000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.AUTOMOTIVE },
                        { 'amazon.bsr': { $lt: 300000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.CELL_PHONES },
                        { 'amazon.bsr': { $lt: 250000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.BOOKS },
                        { 'amazon.bsr': { $lt: 90000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.BABY },
                        { 'amazon.bsr': { $lt: 100000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.BABY_PRODUCTS },
                        { 'amazon.bsr': { $lt: 100000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.CLOTHING },
                        { 'amazon.bsr': { $lt: 300000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.COMPUTERS },
                        { 'amazon.bsr': { $lt: 150000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.HEALTH },
                        { 'amazon.bsr': { $lt: 150000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.KITCHEN_DINING },
                        { 'amazon.bsr': { $lt: 250000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.MUSICAL_INSTRUMENTS },
                        { 'amazon.bsr': { $lt: 40000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
                {
                    $and: [
                        { 'amazon.category': EnumCategories.OTHER },
                        { 'amazon.bsr': { $lt: 200000, $gt: 0 } },
                        { 'amazon.price': { $gt: 15 } },
                        { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
                    ],
                },
            ])
            .skip(randomIndex)
            .exec()

        return res.status(200).json({
            data: firstLead?.toObject(),
        })
    } catch (e: any) {
        return res.status(404).json({
            message: e.message,
        })
    }
})

sourceRoutes.post('/', async (req, res, next) => {
    try {
        type SourceBodyType = {
            title: string
            url: string
            siteName: string
            price: number
            numPack: number
            brand: string
            upc: string
            model: string
            availability: boolean
            images: string[]
            statusCode: number
            createdAt: string | DateConstructor
            updatedAt: string | DateConstructor
            note: string
        }

        const body: SourceBodyType = req.body

        const findSourcesByURL = await LeadModel.find({ 'source.url': body?.url })

        for (let i = 0; i < findSourcesByURL.length; i++) {
            const leadUpdate = findSourcesByURL[i]
            // Set Title
            if (body?.title) {
                leadUpdate.source.title = body?.title
            }
            // Set SiteName
            if (body?.siteName) {
                leadUpdate.source.siteName = body?.siteName
            }
            // Set price
            if (body?.price && body?.price > 0) {
                leadUpdate.source.price = body?.price
            }
            // Set numPack
            if (body?.numPack) {
                leadUpdate.source.numPack = body?.numPack
            }
            // Set brand
            if (body?.brand) {
                leadUpdate.source.brand = body?.brand
            }
            // Set model
            if (body?.model) {
                leadUpdate.source.model = body?.model
            }
            // Set upc
            if (body?.upc && body?.upc.length === 12) {
                leadUpdate.source.upc = body?.upc
            }
            // Set availability
            if (body?.availability) {
                leadUpdate.source.availability = body?.availability
            }
            // Set images
            if (body?.images && body?.images.length) {
                leadUpdate.source.images = body?.images
            }
            // Set statusCode
            if (body?.statusCode) {
                leadUpdate.source.statusCode = body?.statusCode
            }

            // Set Profit & ROI
            if (
                leadUpdate.amazon?.price &&
                leadUpdate.amazon?.price > 0 &&
                leadUpdate.amazon?.category &&
                body?.price &&
                body?.price > 0
            ) {
                const amazonNumber: number = leadUpdate.amazon?.numPack ? leadUpdate.amazon?.numPack : 1
                const sourceNumber: number = leadUpdate.source?.numPack ? leadUpdate.source?.numPack : 1
                const numOfPack: number = parseFloat(String(amazonNumber / sourceNumber))

                const profitROI = new ProfitRoiCalculate({
                    category: leadUpdate.amazon?.category,
                    sellPrice: leadUpdate.amazon?.price ? leadUpdate.amazon?.price * numOfPack : 0,
                    buyCost: leadUpdate.source?.price ? leadUpdate.source?.price : 0,
                    packageLength: leadUpdate.amazon?.package?.length ? leadUpdate.amazon?.package?.length : 1,
                    packageHeight: leadUpdate.amazon?.package?.height ? leadUpdate.amazon?.package?.height : 1,
                    packageWidth: leadUpdate.amazon?.package?.width ? leadUpdate.amazon?.package?.width : 1,
                    packageWeight: leadUpdate.amazon?.package?.weight ? leadUpdate.amazon?.package?.weight : 1,
                })

                leadUpdate.profit = profitROI?.netProfit ? profitROI.netProfit : 0
                leadUpdate.roi = profitROI?.roi ? profitROI.roi : 0
                leadUpdate.amazon.size = profitROI.size
            }

            leadUpdate.source.updatedAt = new Date().toISOString()

            await leadUpdate.save()

            await updateDatabaseLeads(leadUpdate.toObject())
        }

        console.log(`Update success Source: ${body?.url}`)
        return res.status(200).json({
            message: `Update success ASIN: ${body?.url}`,
        })
    } catch (e: any) {
        console.log(e.message)
        res.status(404).json({
            message: e.message,
        })
    }
})

async function updateDatabaseLeads(leadUpdate: ILead) {
    const databaseLeads = new DatabaseLeads()
    await databaseLeads.auth()
    await databaseLeads.addToSheet(leadUpdate)
}

export default sourceRoutes
