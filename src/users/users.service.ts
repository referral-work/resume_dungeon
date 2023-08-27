import { Injectable } from '@nestjs/common';
import { IUser } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPGRADED_MAX_PROMPT_COUNT } from 'src/utils/constants';
import { ILogs } from './logs.model';
import { IRatings } from './rating.model';

@Injectable()
export class UsersService {
    async getRatings() {
      return await this.iratingsModel.find({})
    }
    
    constructor(
        @InjectModel('iuser') private readonly iuserModel: Model<IUser>,
        @InjectModel('ilogs') private readonly ilogsModel: Model<ILogs>,
        @InjectModel('iratings') private readonly iratingsModel: Model<IRatings>){}
    
    async isValidCouponCode(coupon_code: string, existingIUser: any): Promise<boolean> {
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

        // if user exists, coupon code cannot be applied
        if(existingIUser != null){
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
            couponCode: this.generateCouponCode()
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

    generateCouponCode(): string {
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        let randomString = '';
        
        // Add a random uppercase letter as the first character
        randomString += uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));

        // Add random characters from uppercase letters and numbers
        const possibleCharacters = uppercaseLetters + numbers;
        const length = 6;

        for (let i = 1; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
            randomString += possibleCharacters.charAt(randomIndex);
        }
        return randomString;
    }

    async createLog(email: string, resumeText: string, promptText: string) {
        const createLog = new this.ilogsModel({
            email: email,
            prompt: promptText,
            resume: resumeText
        })

        await this.ilogsModel.create(createLog)
    }

    async saveRating(email: string, prompt: number, rating: number) {
        const createRating = new this.iratingsModel({
            email: email,
            prompt: prompt,
            rating: rating
        })

        await this.iratingsModel.create(createRating)
    }
}
