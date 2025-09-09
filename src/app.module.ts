import {  MiddlewareConsumer , Module , NestModule  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, // dynamic based on NODE_ENV
      isGlobal: true, // optional: makes ConfigService available everywhere
    }),
     MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
     UsersModule,
     AuthModule,
     ProductsModule,
     MailModule
  ],
  
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // applies middleware to ALL routes
  }
}

