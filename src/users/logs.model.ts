import * as mongoose from "mongoose"
export const ILogs = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        prompt: {
            type: String,
            required: true
        },
        resume: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export interface ILogs extends mongoose.Document {
    readonly _id: string;
    email: string;
    prompt: string;
    resume: string;
}