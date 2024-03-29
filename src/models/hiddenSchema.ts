import { Schema, Document } from 'mongoose'

export interface IHidden extends Document {
    createdAt: string | DateConstructor
    days: number
}

export const hiddenSchema: Schema = new Schema<IHidden>({
    createdAt: {
        type: Date,
    },
    days: {
        type: Number,
        default: 0,
    },
})
