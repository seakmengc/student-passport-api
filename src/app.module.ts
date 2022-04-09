import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import * as paginator from 'mongoose-paginate-v2';
import { ThrottlerModule } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './modules/upload/upload.module';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('DB_URI'),
          useNewUrlParser: true,
          autoCreate: true,
          autoIndex: false,
          noDelay: true,
          connectionFactory: (connection) => {
            connection.plugin(paginator);

            Logger.log('Connected', 'Mongoose');

            return connection;
          },
        } as MongooseModuleOptions;
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    MulterModule.register({
      dest: './storage/upload',
      limits: {
        fileSize: 1_000_000, //1MB
        files: 1,
      },
    }),
    AuthModule,
    ResetPasswordModule,
    UserModule,
    UploadModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
})
export class AppModule {}
