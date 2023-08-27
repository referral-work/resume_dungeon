import * as mongoose from "mongoose"
export const IRatings = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        prompt: {
            type: Number,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

export interface IRatings extends mongoose.Document {
    readonly _id: string;
    email: string;
    prompt: number;
    rating: number;
}