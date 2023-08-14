import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IUserSchema } from './users.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "iuser", schema : IUserSchema}]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
