import LeadModel from '../../models/LeadModel'

type LeadInput = {
    leadInput: {
        isMatch: string
        profit: number
        roi: number
        amazon: {
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
            createdAt: string
            updatedAt: string
            // leads: [string]
        }
        source: {
            title: string
            url: string
            siteName: string
            price: number
            numPack: number
            brand: string
            upc: string
            model: string
            availability: boolean
            images: [string]
            statusCode: number
            // leads: [string]
        }
    }
}

type IdType = {
    ID?: string
}

export const getLeads = {
    getLeads: async (_: any, { first, offset, where }: any) => {
        try {
            /*const lead = new LeadModel({
                isMatch: 'mis_match',
                source: {
                    url: 'https://google.com',
                },
                amazon: {
                    asin: 'B00LJOQO61',
                },
            })*/
            const lead = await LeadModel.findOne({ 'amazon.asin': 'B00LJOQO61' })
            if (lead) {
                lead.amazon.asin = 'B00LJOQO62'
                await lead.save()
            }
        } catch (e: any) {
            console.log(e.message)
        }
        /*const totalCount = await LeadModel.find().countDocuments()
const leads = await LeadModel.find()
    .skip(first)
    .limit(offset)
    // .populate('amazon')
    // .populate('source')
    // .sort({ 'amazon._id': first })
    .exec()

return {
    totalCount,
    nodes: leads.map((lead) => {
        return {
            ...lead.toObject(),
        }
    }),
}*/

        return 'String'
    },
}

export const createLead = {
    createLead: async (_: any, { leadInput: { isMatch, profit, roi, amazon, source } }: LeadInput) => {
        /*const session = await mongoose.startSession()
session.startTransaction({
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
})
try {
    // Amazon
    const findAmazonByAsin = await AmazonModel.findOne({ asin: amazon.asin })
    let amazonId
    if (!findAmazonByAsin) {
        const createAmazonByAsin = new AmazonModel(amazon)
        await createAmazonByAsin.save({ session })
        amazonId = createAmazonByAsin._id
    } else {
        amazonId = findAmazonByAsin._id

        for (const field in amazon) {
            // @ts-ignore
            findAmazonByAsin[field] = amazon[field]
        }

        findAmazonByAsin.save({ session })
    }

    // Source
    const findSourceByURL = await SourceModel.findOne({ url: source.url })
    let sourceId
    if (!findSourceByURL) {
        const createSourceByURL = new SourceModel(source)
        await createSourceByURL.save({ session })
        sourceId = createSourceByURL._id
    } else {
        sourceId = findSourceByURL._id

        for (const field in source) {
            // @ts-ignore
            findSourceByURL[field] = source[field]
        }

        findSourceByURL.save({ session })
    }

    // Check Lead Exist
    const leadExist = await LeadModel.findOne({ amazon: amazonId, source: sourceId })
    if (leadExist) {
        throw new Error('This lead is exist!')
    }

    // Lead
    const createdLead = new LeadModel({
        isMatch,
        profit,
        roi,
        amazon: amazonId,
        source: sourceId,
        createdAt: new Date().toISOString(),
    })

    const res = await createdLead.save({ session })

    await session.commitTransaction()

    // Update Amazon
    const updateAmazon = await AmazonModel.findOne({ _id: amazonId })
    if (updateAmazon) {
        updateAmazon.leads.push(res._id)
        await updateAmazon.save({ session })
    }

    // Update Source
    const updateSource = await SourceModel.findOne({ _id: sourceId })
    if (updateSource) {
        updateSource.leads.push(res._id)
        await updateSource.save({ session })
    }

    return {
        status: {
            success: true,
        },
        lead: {
            id: res.id,
            ...res.toObject(),
            amazon: updateAmazon?.toObject(),
            source: updateSource?.toObject(),
        },
    }
} catch (e: any) {
    await session.abortTransaction()
    return {
        status: {
            success: false,
            message: e.message,
        },
    }
} finally {
    await session.endSession()
}*/
        return 'String'
    },
}

export const createLeadById = {
    createLeadById: async (_: any, { leadInput: { isMatch, profit, roi, amazon, source } }: LeadInput) => {
        /*try {
    const createdLead = new LeadModel({
        isMatch,
        profit,
        roi,
        amazon,
        source,
        createdAt: new Date().toISOString(),
    })

    const res = await createdLead.save()

    // Update Amazon
    await AmazonModel.updateOne({ _id: amazon }, { $push: { leads: res._id } })

    // Update Source
    await SourceModel.updateOne({ _id: source }, { $push: { leads: res._id } })

    return {
        status: {
            success: true,
        },
        lead: {
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
}*/
        return 'String'
    },
}

export const deleteLead = {
    deleteLead: async (_: any, { ID }: any): Promise<any> => {
        /*try {
    const wasDeleted = (await LeadModel.deleteOne({ _id: ID })).deletedCount
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
}*/

        return 'String'
    },
}

export const editLead = {
    editLead: async (_: any, { ID, leadInput: { isMatch, profit, roi, amazon, source } }: IdType & LeadInput) => {
        /*const session = await mongoose.startSession()
session.startTransaction({
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
})
try {
    // Amazon
    const findAmazonByAsin = await AmazonModel.findOne({ asin: amazon.asin })
    let amazonId
    if (!findAmazonByAsin) {
        const createAmazonByAsin = new AmazonModel(amazon)
        await createAmazonByAsin.save({ session })
        amazonId = createAmazonByAsin._id
    } else {
        amazonId = findAmazonByAsin._id
        for (const field in amazon) {
            // @ts-ignore
            findAmazonByAsin[field] = amazon[field]
        }

        findAmazonByAsin.save({ session })
    }

    // Source
    const findSourceByURL = await SourceModel.findOne({ url: source.url })
    let sourceId
    if (!findSourceByURL) {
        const createSourceByURL = new SourceModel(source)
        await createSourceByURL.save({ session })
        sourceId = createSourceByURL._id
    } else {
        sourceId = findSourceByURL._id
        for (const field in source) {
            // @ts-ignore
            findSourceByURL[field] = source[field]
        }

        findSourceByURL.save({ session })
    }

    // Check Lead Exist
    const leadExist = await LeadModel.findOne({ _id: ID })
    if (!leadExist) {
        throw new Error('This lead is exist!')
    }

    // Update Lead
    if (isMatch) leadExist.isMatch = isMatch

    if (profit) leadExist.profit = profit

    if (roi) leadExist.roi = roi

    if (amazonId) leadExist.amazon = amazonId

    if (sourceId) leadExist.source = sourceId

    leadExist.updatedAt = new Date().toISOString()

    const res = await leadExist.save({ session })

    await session.commitTransaction()

    // Update Amazon
    const updateAmazon = await AmazonModel.findOne({ _id: amazonId })
    if (updateAmazon) {
        updateAmazon.leads.push(res._id)
        await updateAmazon.save({ session })
    }

    // Update Source
    const updateSource = await SourceModel.findOne({ _id: sourceId })
    if (updateSource) {
        updateSource.leads.push(res._id)
        await updateSource.save({ session })
    }

    return {
        status: {
            success: true,
        },
        lead: {
            id: res.id,
            ...res.toObject(),
            amazon: updateAmazon?.toObject(),
            source: updateSource?.toObject(),
        },
    }
} catch (e: any) {
    await session.abortTransaction()
    return {
        status: {
            success: false,
            message: e.message,
        },
    }
} finally {
    await session.endSession()
}*/

        return 'String'
    },
}

/*export const editLead = {
    editLead: async (_: any, { ID, leadInput: { isMatch, profit, roi, amazon, source } }: IdType & LeadInput) => {
        try {
            const wasEdited = (await Lead.updateOne({ _id: ID }, { isMatch, profit, roi, amazon, source }))
                .modifiedCount

            // Update Amazon
            await Amazon.updateOne({ _id: amazon }, { $push: { leads: ID } })

            // Update Source
            await Source.updateOne({ _id: source }, { $push: { leads: ID } })

            const findEdited = await Lead.findOne({ _id: ID }).populate('amazon').populate('source').exec()
            return {
                status: {
                    success: wasEdited !== 0,
                },
                lead: {
                    _id: ID,
                    ...findEdited?.toObject(),
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
}*/
