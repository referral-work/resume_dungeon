import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { prompts } from 'src/utils/constants';
const JinaAI = require('jinaai');

@Controller('api/user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService) {}

   // validate user
   @Post('validate')
   async validate(
     @Body('data') data: any,
     @Req() req: Request,
     @Res() res: Response
   ) {
    const ip = data.ip
    const coupon_code = data.coupon_code
    const email = data.email

    // check for existing user
    const existingIUser = await this.usersService.findUserByEmail(email)

    if(coupon_code != null){
      // check if coupon_code is valid
      // if valid, update maxPromptCount for coupon provider and return true
      // if invalid, return false
      const isCouponValid = await this.usersService.isValidCouponCode(coupon_code, existingIUser);

      if(!isCouponValid) {
        return res.status(400).json({msg: "Coupon code is invalid or expired!"})
      } 
    }

    // check if ip is allowed or not (ip should not be associated with more than 1 account)
    // const isIPValid = await this.usersService.isIPAllowed(ip, email)
    // if(!isIPValid) {
    //   return res.status(400).json({msg: "Same IP cannot be used for multiple accounts"})
    // }
    
    var iuser = null
    if(existingIUser == null || existingIUser == undefined){
      iuser = await this.usersService.saveUser(email, ip)
    } else {
     
      // check if limit needs to be renewed
      const isLimitRenewalValid = this.usersService.isLimitRenewalValid(existingIUser)

      if(isLimitRenewalValid) {
        console.log("renewing limit...")
        existingIUser.currentPromptCount = 0
      }
      existingIUser.ip = ip
      iuser = await this.usersService.updateUser(existingIUser)
    }

    return res.status(200).json({maxPromptCount: iuser.currentMaxPromptCount, usedPromptCount: iuser.currentPromptCount, couponCode: iuser.couponCode})
   }

   // validate user
   @Post('generate')
   async generateTextFromPrompt(
     @Body('data') data: any,
     @Req() req: Request,
     @Res() res: Response
   ) {
    const resumeText = data.resumeText
    const queryIndex = data.queryIndex
    const email = data.email
    const jobProfile = data.jobProfile
    let queryText = ''

    if(queryIndex < 3){
      queryText = prompts[queryIndex]
    } else {
      queryText = prompts[3] + jobProfile + prompts[4]
    }
    let existingIUser = await this.usersService.findUserByEmail(email)
    if(existingIUser == null || existingIUser == undefined) {
      return res.status(404).json({msg: "requesting resource with wrong email"})
    }

    // check if limit needs to be renewed
    const isLimitRenewalValid = this.usersService.isLimitRenewalValid(existingIUser)

    if(isLimitRenewalValid) {
      console.log("renewing limit...")
      existingIUser.currentPromptCount = 0
      await this.usersService.updateUser(existingIUser)
    }
    else {
      // check if limit for prompts is reached on this account for the day
      const isPromptLimitReached = (existingIUser.currentPromptCount === existingIUser.currentMaxPromptCount)
      if(isPromptLimitReached) {
        return res.status(400).json({msg: "today's prompt limit is used!", currentPromptCount: existingIUser.currentPromptCount, curruentMaxPromptCount: existingIUser.currentMaxPromptCount})
      }
    }
    console.log("calling JInaAi...")
    let jinaai = new JinaAI({ secrets: {
      'jinachat-secret': this.configService.get<string>('JINA_API_KEY')
    }});
    let output 
      = await jinaai.generate(
        resumeText + ". " + queryText
      );
    console.log("jinaai has given some response..")
    existingIUser.currentPromptCount = existingIUser.currentPromptCount + 1
    existingIUser.resume = resumeText
    await this.usersService.updateUser(existingIUser)
    await this.usersService.createLog(email, resumeText, queryText)
    return res.status(200).json({responseText: output.output, currentPromptCount: existingIUser.currentPromptCount, currentMaxPromptCount: existingIUser.currentMaxPromptCount, couponCode: existingIUser.couponCode})
   }

   // validate user
   @Post('details')
   async getUserDetails(
     @Body('data') data: any,
     @Req() req: Request,
     @Res() res: Response
   ) {
    const email = data.email

    let existingIUser = await this.usersService.findUserByEmail(email)
    if(existingIUser == null || existingIUser == undefined) {
      return res.status(404).json({msg: "requesting resource with wrong email"})
    }

    // check if limit needs to be renewed
    const isLimitRenewalValid = this.usersService.isLimitRenewalValid(existingIUser)

    if(isLimitRenewalValid) {
      console.log("renewing limit...")
      existingIUser.currentPromptCount = 0
      await this.usersService.updateUser(existingIUser)
    }
    
    return res.status(200).json({currentPromptCount: existingIUser.currentPromptCount, currentMaxPromptCount: existingIUser.currentMaxPromptCount, couponCode: existingIUser.couponCode})
   }
}