import { Schema, Document, model, Model } from 'mongoose'
import { ILead, leadSchema } from './LeadModel'

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
    images: string[] | undefined
    statusCode: number
    createdAt: string | DateConstructor
    updatedAt: string | DateConstructor
    note: string
}

export const sourceSchema: Schema = new Schema<ISource>({
    title: {
        type: String,
        minlength: 5,
        maxlength: 500,
    },
    url: {
        type: String,
        // unique: true,
        required: true,
        // minlength: 5,
        // maxlength: 500,
        validate: {
            validator: function (value: string) {
                const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/
                return urlRegex.test(value)
            },
            message: 'URL address is incorrect!',
        },
    },
    siteName: {
        type: String,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
    },
    brand: {
        type: String,
        minlength: 1,
        maxlength: 30,
    },
    upc: {
        type: String,
        minlength: 12,
        maxlength: 12,
    },
    model: {
        type: String,
        minlength: 1,
        maxlength: 30,
    },
    price: {
        type: Number,
    },
    numPack: {
        type: Number,
        min: 1,
        max: 100,
    },
    availability: {
        type: Boolean,
        default: false,
    },
    images: [
        {
            type: String,
        },
    ],
    statusCode: {
        type: Number,
        default: 200,
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: new Date().toISOString(),
    },
    note: {
        type: String,
        minlength: 1,
        maxlength: 500,
    },
})

/*sourceSchema.pre('save', function (next) {
    this.updatedAt = new Date().toISOString()
    next()
})

const SourceModel: Model<ISource> = model<ISource>('Source', sourceSchema)

export default SourceModel*/
