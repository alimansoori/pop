import { Schema, Document, model, Model } from 'mongoose'
import any = jasmine.any

export interface IAmazon extends Document {
    title: string
    asin: string
    url: string
    price: number
    numPack: number
    category: string
    upc: string[]
    seller: string
    images: string[]
    graphImage: {
        data: Buffer
        contentType: string
    }
    bsr: number
    mSales: number
    size: string
    brand: string
    note: string
    csv: any[]
    package: {
        length: number
        width: number
        height: number
        weight: number
    }
    createdAt: string | DateConstructor
    updatedAt: string | DateConstructor
}

export const amazonSchema: Schema = new Schema<IAmazon>({
    title: {
        type: String,
        minlength: 5,
        maxlength: 500,
    },
    asin: {
        type: String,
        // unique: true,
        required: true,
        // minlength: 10,
        // maxlength: 10,
    },
    url: {
        type: String,
        lowercase: true,
        minlength: 5,
        maxlength: 500,
        validate: {
            validator: function (value: string) {
                const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/
                return urlRegex.test(value)
            },
            message: 'URL address is incorrect!',
        },
    },
    price: Number,
    numPack: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
    },
    category: {
        type: String,
        minlength: 3,
        maxlength: 50,
        default: 'Other',
    },
    upc: [
        {
            type: String,
            minlength: 12,
            maxlength: 12,
        },
    ],
    seller: {
        type: String,
    },
    bsr: Number,
    mSales: Number,
    size: String,
    brand: String,
    images: [
        {
            type: String,
        },
    ],
    graphImage: {
        data: Buffer,
        contentType: String,
    },
    note: String,
    csv: Array,
    package: {
        length: {
            type: Number,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        weight: {
            type: Number,
        },
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
})

/*amazonSchema.pre('save', function (next) {
    this.updatedAt = new Date().toISOString()
    next()
})

const AmazonModel: Model<IAmazon> = model<IAmazon>('Amazon', amazonSchema)

export default AmazonModel*/
