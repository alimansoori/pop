import AmazonModel from '../../models/AmazonModel'
import LeadModel from '../../models/LeadModel'

type AmazonInput = {
    amazonInput: {
        title: string
        url: string
        asin: string
        numPack: number
        price: number
        category: string
        upc: [string]
        seller: string
        bsr: number
        mSales: number
        leads: [string]
    }
}

type IdType = {
    ID?: string
}

const leads = async (leadIds: any) => {
    if (!leadIds || !leadIds?.length) {
        return []
    }
    return LeadModel.find({ _id: { $in: leadIds } })
}

export const getAmazons = {
    getAmazons: async (_: any, { amount }: any) => {
        const amazons = await AmazonModel.find().populate('leads').sort({ createdAt: -1 }).limit(amount).exec()
        return amazons.map((amazon) => {
            return {
                ...amazon.toObject(),
            }
        })
    },
}

export const createAmazon = {
    createAmazon: async (
        _: any,
        { amazonInput: { title, url, asin, numPack, upc, bsr, mSales, price, seller, category, leads } }: AmazonInput
    ) => {
        try {
            const createdAmazon = new AmazonModel({
                title: title,
                asin: asin,
                url: url,
                createdAt: new Date().toISOString(),
            })

            const res = await createdAmazon.save()

            return {
                status: {
                    success: true,
                },
                amazon: {
                    id: res.id,
                    ...res.toObject(),
                },
            }
        } catch (e: any) {
            return {
                status: {
                    success: false,
                    message: e.message,
                },
            }
        }
    },
}

export const deleteAmazon = {
    deleteAmazon: async (_: any, { ID }: any): Promise<any> => {
        try {
            const wasDeleted = (await AmazonModel.deleteOne({ _id: ID })).deletedCount
            return {
                status: {
                    success: wasDeleted !== 0,
                },
            }
        } catch (e: any) {
            return {
                status: {
                    success: false,
                    message: e.message,
                },
            }
        }
    },
}

export const editAmazon = {
    editAmazon: async (
        _: any,
        {
            ID,
            amazonInput: { title, url, asin, numPack, upc, bsr, mSales, price, seller, category, leads },
        }: IdType & AmazonInput
    ) => {
        try {
            const wasEdited = (
                await AmazonModel.updateOne(
                    { _id: ID },
                    { title, url, asin, numPack, upc, bsr, mSales, price, seller, category, leads }
                )
            ).modifiedCount
            const findUpdated = await AmazonModel.findOne({ _id: ID }).exec()
            return {
                status: {
                    success: wasEdited !== 0,
                },
                amazon: {
                    _id: ID,
                    ...findUpdated?.toObject(),
                },
            }
        } catch (e: any) {
            return {
                status: {
                    success: false,
                    message: e.message,
                },
            }
        }
    },
}
