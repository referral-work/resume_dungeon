import * as mongoose from "mongoose"
export const IUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        currentPromptCount: {
            type: Number,
            default:0
        },
        currentMaxPromptCount: {
            type: Number,
            default: 2
        },
        couponCode: {
            type: String,
            default: '',
            required: false
        },
        couponUsed: {
            type: Boolean,
            default: false,
        },
        ip: {
            type: String,
            required: true,
        },
        resume: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

export interface IUser extends mongoose.Document {
    readonly _id: string;
    email: string;
    currentPromptCount: number;
    currentMaxPromptCount: number;
    couponCode: string;
    couponUsed: boolean;
    ip: string;
    resume: string;
}