type SourceInput = {
    sourceInput: {
        title?: string
        url: string
        siteName?: string
        price?: number
        numPack?: number
        brand?: string
        upc?: string
        model?: string
        availability?: boolean
        images?: [string]
        statusCode?: number
        // leads?: [string]
    }
}

type SourceEditInput = {
    sourceEditInput: {
        url: string
        numPack?: number
    }
}

type IdType = {
    ID?: string
}

export const getSourceById = {
    getSourceById: async (_: any, { ID }: any) => {
        // return SourceModel.findById(ID)
        return 'String'
    },
}

export const getSources = {
    getSources: async (_: any, { amount }: any) => {
        // return SourceModel.find().sort({ createdAt: -1 }).limit(amount)
        return 'String'
    },
}

export const createSource = {
    createSource: async (
        _: any,
        {
            sourceInput: {
                title,
                url,
                siteName,
                upc,
                // leads,
                numPack,
                brand,
                images,
                model,
                price,
                statusCode,
                availability,
            },
        }: SourceInput
    ) => {
        /*const createdSource = new SourceModel({
            title,
            url,
            siteName,
            upc,
            // leads,
            numPack,
            brand,
            images,
            model,
            price,
            statusCode,
            availability,
            createdAt: new Date().toISOString(),
        })

        try {
            const res = await createdSource.save()

            return {
                status: {
                    success: true,
                },
                source: {
                    id: res.id,
                    ...res.toObject(),
                },
            }
        } catch (err: any) {
            return {
                status: {
                    success: false,
                    message: err.message,
                },
            }
        }*/

        return 'String'
    },
}

export const deleteSource = {
    deleteSource: async (_: any, { ID }: any): Promise<any> => {
        /*try {
            const wasDeleted = (await SourceModel.deleteOne({ _id: ID })).deletedCount
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

export const editSource = {
    editSource: async (
        _: any,
        {
            ID,
            sourceInput: {
                title,
                url,
                siteName,
                upc,
                // leads,
                numPack,
                brand,
                images,
                model,
                price,
                statusCode,
                availability,
            },
        }: IdType & SourceInput
    ) => {
        /*try {
            const edited = await SourceModel.updateOne(
                { _id: ID },
                {
                    title,
                    url,
                    siteName,
                    upc,
                    leads,
                    numPack,
                    brand,
                    images,
                    model,
                    price,
                    statusCode,
                    availability,
                    updatedAt: new Date().toISOString(),
                }
            )
            const wasEdited = edited.modifiedCount
            // const updated = await SourceModel.findOne({ _id: ID }).populate('leads').exec()
            const updated = await SourceModel.findOne({ _id: ID }).exec()
            return {
                status: {
                    success: wasEdited !== 0,
                },
                source: {
                    _id: ID,
                    ...updated?.toObject(),
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
