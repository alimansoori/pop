import { Schema, Document, model, Model } from 'mongoose'
import { ILead } from './LeadModel'

export interface IAmazon extends Document {
    title: string
    asin: string
    url: string
    price: number
    numPack: number
    category: string
    upc: [string]
    seller: string
    bsr: number
    mSales: number
    createdAt: string
    updatedAt: string
    leads: [string | ILead]
}

export const amazonSchema = new Schema<IAmazon>({
    title: String,
    asin: {
        type: String,
        unique: true,
        required: true,
    },
    url: String,
    price: Number,
    numPack: {
        type: Number,
        default: 1,
    },
    category: String,
    upc: [String],
    seller: String,
    bsr: Number,
    mSales: Number,
    createdAt: Date,
    updatedAt: Date,
    leads: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
        },
    ],
})

const AmazonModel: Model<IAmazon> = model<IAmazon>('Amazon', amazonSchema)

export default AmazonModel
