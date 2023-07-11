import express, { NextFunction, Request, Response } from 'express'
import LeadModel, { ILead } from '../../models/LeadModel'
import { error } from 'shelljs'
import mongoose, { Document, Model, ObjectId, Query } from 'mongoose'
import Keepa from '../../lib/Keepa'
import KeepaApi from '../../lib/KeepaApi'
import ProfitRoiCalculate from '../../lib/ProfitRoiCalculate'
import { generateKeyPair } from 'crypto'

const sourceRoutes = express.Router()

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
            if (body?.price) {
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
            if (body?.upc) {
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
            if (leadUpdate.amazon?.price && leadUpdate.amazon?.category) {
                const profitROI = new ProfitRoiCalculate({
                    category: leadUpdate.amazon?.category,
                    sellPrice: leadUpdate.amazon?.price ? leadUpdate.amazon?.price : 0,
                    buyCost: leadUpdate.source?.price ? leadUpdate.source?.price : 0,
                    packageLength: leadUpdate.amazon?.package?.length ? leadUpdate.amazon?.package?.length : 1,
                    packageHeight: leadUpdate.amazon?.package?.height ? leadUpdate.amazon?.package?.height : 1,
                    packageWidth: leadUpdate.amazon?.package?.width ? leadUpdate.amazon?.package?.width : 1,
                    packageWeight: leadUpdate.amazon?.package?.weight ? leadUpdate.amazon?.package?.weight : 1,
                })

                leadUpdate.profit = profitROI.netProfit ? profitROI.netProfit : 0
                leadUpdate.roi = profitROI.roi ? profitROI.roi : 0
                leadUpdate.amazon.size = profitROI.size
            }

            leadUpdate.source.updatedAt = new Date().toISOString()

            await leadUpdate.save()
            console.log(leadUpdate.toObject())
        }

        console.log(`Update success Source: ${body?.url}`)
        return res.status(200).json({
            message: `Update success ASIN: ${body?.url}`,
        })
    } catch (e: any) {
        console.log(e.message)
        res.status(200).json({
            message: e.message,
        })
    }
})

export default sourceRoutes
