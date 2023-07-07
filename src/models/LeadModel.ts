import mongoose, { Schema, Document, model, Model } from 'mongoose'
import { ISource } from './SourceModel'
import { amazonSchema, IAmazon } from './AmazonModel'
import sourceSchema from '../graphql/schema/sourceSchema'

export interface ILead extends Document {
    isMatch: string
    profit: number
    roi: number
    source: string | ISource
    amazon: string | IAmazon
    createdAt: string
    updatedAt: string
}

export const leadSchema = new Schema<ILead>({
    isMatch: {
        type: String,
        enum: ['Match', 'MisMatch', 'Not Checked'],
        default: 'Not Checked',
    },
    profit: Number,
    roi: Number,
    source: sourceSchema,
    amazon: amazonSchema,
    createdAt: Date,
    updatedAt: Date,
})

const LeadModel: Model<ILead> = model<ILead>('Lead', leadSchema)

export default LeadModel
