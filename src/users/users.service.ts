import { Injectable } from '@nestjs/common';
import { IUser } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { INITIAL_MAX_PROMPT_COUNT, UPGRADED_MAX_PROMPT_COUNT } from 'src/utils/constants';

@Injectable()
export class UsersService {
    
    constructor(@InjectModel('iuser') private readonly iuserModel: Model<IUser>){}
    
    async isValidCouponCode(coupon_code: string): Promise<boolean> {
        const iuser = await this.iuserModel.findOne(
            {
                couponCode: coupon_code
            })
        if(iuser == null || iuser == undefined){
            return false
        }

        else if(iuser.couponUsed == true){
            return false
        }
        iuser.couponUsed = true
        iuser.currentMaxPromptCount = UPGRADED_MAX_PROMPT_COUNT

        await this.iuserModel.updateOne({ _id: iuser.id }, iuser)
        return true
    }

    async isIPAllowed(ip: string, email: string): Promise<boolean> {
        const iuser = await this.iuserModel.findOne(
            {
                ip: ip
            })
        if(iuser != null && iuser.email != email) {
            return false
        }
        return true
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.iuserModel.findOne(
            {
                email: email
            }
        )
    }

    async saveUser(email: string, ip: string) {
        const newIUser = new this.iuserModel({
            email: email,
            ip: ip,

        })
        return await this.iuserModel.create(newIUser)
    }

    async updateUser(iuser: IUser) {
        await this.iuserModel.updateOne({_id: iuser.id}, iuser)
        return iuser
    }

    isLimitRenewalValid(existingIUser: any): boolean {
        const today = new Date();

        // Convert today's date to GMT+5:30 timezone
        const gmtOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
        const todayInGMT530 = new Date(today.getTime() + gmtOffset);
        const todayYear = todayInGMT530.getUTCFullYear();
        const todayMonth = todayInGMT530.getUTCMonth();
        const todayDay = todayInGMT530.getUTCDate();

        // Convert the UTC date to GMT+5:30 timezone
        const utcDateToCompare = new Date(existingIUser.updatedAt);
        const utcDateInGMT530 = new Date(utcDateToCompare.getTime() + gmtOffset);
        const compareYear = utcDateInGMT530.getUTCFullYear();
        const compareMonth = utcDateInGMT530.getUTCMonth();
        const compareDay = utcDateInGMT530.getUTCDate();
        
        if (todayYear > compareYear ||
            (todayYear === compareYear && todayMonth > compareMonth) ||
            (todayYear === compareYear && todayMonth === compareMonth && todayDay > compareDay)) {
          return true
        } 
        return false
    }

    async isPromptLimitReached(email: string): Promise<boolean> {
        
        return false
    }
}
