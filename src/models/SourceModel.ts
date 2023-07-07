import { Schema, Document, model, Model } from 'mongoose'
import { ILead } from './LeadModel'

export interface ISource extends Document {
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
    createdAt: string
    updatedAt: string
    leads: [string | ILead]
    note: string
}

const sourceSchema = new Schema<ISource>({
    title: String,
    url: {
        type: String,
        unique: true,
        required: true,
    },
    siteName: String,
    brand: String,
    upc: String,
    model: String,
    price: Number,
    numPack: Number,
    availability: {
        type: Boolean,
        default: false,
    },
    images: [String],
    statusCode: {
        type: Number,
        default: 200,
    },
    createdAt: Date,
    updatedAt: Date,
    leads: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
        },
    ],
    note: String,
})

const SourceModel: Model<ISource> = model<ISource>('Source', sourceSchema)

export default SourceModel
