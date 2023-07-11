import { Schema, Document, model, Model } from 'mongoose'
import { sourceSchema, ISource } from './SourceModel'
import { amazonSchema, IAmazon } from './AmazonModel'
import ProfitRoiCalculate from '../lib/ProfitRoiCalculate'
import { hiddenSchema, IHidden } from './hiddenSchema'

export interface ILead extends Document {
    status: string
    profit: number
    roi: number
    hidden: IHidden
    source: ISource
    amazon: IAmazon
    createdAt: string | DateConstructor
    updatedAt: string | DateConstructor
}

export const leadSchema: Schema = new Schema<ILead>({
    status: {
        type: String,
        enum: ['match', 'mis_match', 'not_checked'],
        default: 'not_checked',
        lowercase: true,
    },
    profit: {
        type: Number,
    },
    roi: Number,
    hidden: hiddenSchema,
    source: {
        type: sourceSchema,
        required: true,
    },
    amazon: {
        type: amazonSchema,
        required: true,
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

leadSchema.methods.sayHi = function () {
    console.log(`Profit is equal ${this.profit}`)
}

leadSchema.pre('save', async function (next) {
    this.updatedAt = new Date().toISOString()
    if (!this._id) {
        // Create Lead
        const duplicateLead = await LeadModel.find({ 'amazon.asin': this.amazon.asin, 'source.url': this.source.url })
        if (duplicateLead.length) {
            throw new Error('This is a repeated lead')
        }
    } else {
        // Edit Lead
        const beforeUpdateLead = await LeadModel.findById(this._id)

        // Profit ROI Calc
        if (beforeUpdateLead) {
            if (
                (beforeUpdateLead.amazon.price !== this.amazon.price ||
                    beforeUpdateLead.source.price !== this.source.price) &&
                this.amazon?.price &&
                this.source?.price
            ) {
                const calc = new ProfitRoiCalculate({
                    sellPrice: this.amazon.price,
                    buyCost: this.source.price,
                    packageWeight: this.amazon?.package?.weight ? this.amazon?.package?.weight : 1,
                    packageWidth: this.amazon?.package?.width ? this.amazon?.package?.width : 1,
                    packageHeight: this.amazon?.package?.height ? this.amazon?.package?.height : 1,
                    packageLength: this.amazon?.package?.length ? this.amazon?.package?.length : 1,
                    category: this.amazon.category,
                })
                this.amazon.size = calc.size
                this.profit = calc.netProfit
                this.roi = calc.roi
            }
        }

        // Check is Duplicate
        if (beforeUpdateLead) {
            if (
                !(beforeUpdateLead.amazon.asin === this.amazon.asin && beforeUpdateLead.source.url === this.source.url)
            ) {
                const duplicateLead = await LeadModel.find({
                    'amazon.asin': this.amazon.asin,
                    'source.url': this.source.url,
                })
                if (duplicateLead.length) {
                    throw new Error('This is a repeated lead')
                }
            }
        }
    }

    next()
})

leadSchema.pre('validate', async function () {
    if (isNaN(this?.profit)) {
        this.profit = 0
    } else if (this?.profit) this.profit = parseInt(this.profit)

    if (isNaN(this?.roi)) {
        this.roi = 0
    } else if (this?.roi) this.roi = parseInt(this.roi)

    if (this?.amazon?.price) this.amazon.price = parseInt(this.amazon.price)
    if (this?.amazon?.bsr) this.amazon.bsr = parseInt(this.amazon.bsr)
    if (this?.amazon?.mSales) this.amazon.mSales = parseInt(this.amazon.mSales)
    if (this?.amazon?.numPack) this.amazon.numPack = parseInt(this.amazon.numPack)
    if (this?.source?.price) this.source.price = parseInt(this.source.price)
    if (this?.source?.numPack) this.source.numPack = parseInt(this.source.numPack)
    if (this?.source?.statusCode) this.source.statusCode = parseInt(this.source.statusCode)
})

leadSchema.post('save', function (doc, next) {
    // console.log('Hi post saved')
    next()
})

const LeadModel: Model<ILead> = model<ILead>('Lead', leadSchema)

export default LeadModel
