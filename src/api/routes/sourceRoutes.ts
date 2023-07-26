import express from 'express'
import LeadModel, { ILead } from '../../models/lead/LeadModel'
import ProfitRoiCalculate from '../../lib/ProfitRoiCalculate'
import DatabaseLeads from '../../sheets/DatabaseLeads'
import MyArray from '../../lib/MyArray'
import AmazonCategory from '../../lib/AmazonCategory'

const sourceRoutes = express.Router()

sourceRoutes.get('/', async (req, res, next) => {
    try {
        /*for (let i = 1; i <= 35; i++) {
            await insetToDB(i)
            console.log(`insert output${i}`)
        }

        return res.status(200).json({
            message: 'Success',
        })*/

        const randomIndex = Math.floor(Math.random() * 50)

        const randLead = await LeadModel.findOne()
            .lean()
            .select(['_id', 'source.url', 'source.updatedAt', 'amazon.category', 'amazon.price', 'amazon.seller'])
            .skip(randomIndex)
            .sort({ 'source.updatedAt': 1 })
            .and([
                { 'amazon.category': MyArray.gerRandomFromArrayOfString(AmazonCategory.categoryLists()) },
                { status: { $ne: 'mis_match' } },
                { 'amazon.bsr': { $lt: 312000, $gt: 0 } },
                { 'amazon.price': { $gt: 15 } },
                { 'amazon.seller': { $not: new RegExp(`^Amazon$`, 'i') } },
            ])
            .exec()

        if (randLead) {
            return res.status(200).json({
                data: randLead,
            })
        }

        return res.status(200).json({
            data: null,
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
            canonical: string
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
            // Set Canonical
            if (body?.canonical && body?.canonical !== body?.url) {
                leadUpdate.source.url = body?.canonical
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
            // Set note
            if (body?.note) {
                leadUpdate.source.note = body.note
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
                    sellPrice: leadUpdate.amazon?.price ? leadUpdate.amazon?.price : 0,
                    buyCost: leadUpdate.source?.price ? leadUpdate.source?.price * numOfPack : 0,
                    fbaFees: {
                        pickAndPackFee: leadUpdate.amazon?.fbaFees?.pickAndPackFee,
                    },
                    referralFeePercent: leadUpdate.amazon?.referralFeePercent,
                    packageLength: leadUpdate.amazon?.package?.length ? leadUpdate.amazon?.package?.length : 1,
                    packageHeight: leadUpdate.amazon?.package?.height ? leadUpdate.amazon?.package?.height : 1,
                    packageWidth: leadUpdate.amazon?.package?.width ? leadUpdate.amazon?.package?.width : 1,
                    packageWeight: leadUpdate.amazon?.package?.weight ? leadUpdate.amazon?.package?.weight : 1,
                })

                leadUpdate.profit = profitROI?.getProfit() ? profitROI.getProfit() : 0
                leadUpdate.roi = profitROI?.getROI() ? profitROI.getROI() : 0
                leadUpdate.amazon.size = profitROI.getSize()
            }

            leadUpdate.source.updatedAt = new Date().toISOString()

            await leadUpdate.save()

            await updateDatabaseLeads(leadUpdate.toObject())
            console.log(`${i + 1} Update success Source: ${body?.url}`)
            console.log(`=============================================`)
        }

        if (!findSourcesByURL.length) {
            throw new Error(`Not Exist Source: ${body?.url}`)
        }
        return res.status(200).json({
            message: `Update success URL: ${body?.url}`,
        })
    } catch (e: any) {
        console.log(e.message)
        res.status(404).json({
            message: e.message,
        })
    }
})

async function updateDatabaseLeads(leadUpdate: ILead) {
    if (leadUpdate.profit > 4 && leadUpdate.roi > 25 && leadUpdate.source.availability) {
        const databaseLeads = new DatabaseLeads()
        await databaseLeads.auth()
        await databaseLeads.addToSheet(leadUpdate)
    }
}

/*async function insetToDB(index: number) {
    const data = await fs.promises.readFile(`tmp/output${index}.json`, 'utf8')
    const jsonData = JSON.parse(data)

    await LeadModel.insertMany(jsonData)
}*/

export default sourceRoutes
