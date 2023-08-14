import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://rock-fever:VxZTwfEeBu5sdq4u@cluster0.ms0z8ba.mongodb.net/?retryWrites=true&w=majority'), 
    UsersModule,
    ConfigModule.forRoot({isGlobal: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
