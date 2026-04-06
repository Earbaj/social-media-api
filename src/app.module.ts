import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, // ১. ConfigModule লোড করা
    ConfigModule.forRoot({
      isGlobal: true, // যাতে সব মডিউলে বারবার ইমপোর্ট করতে না হয়
    }),

    // ২. Async ভাবে Mongoose কানেক্ট করা
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
