import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { resolve, join } from 'path';
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { OfficeModule } from './modules/office/office.module';
import { QuestModule } from './modules/quest/quest.module';
import { StudentOfficeModule } from './modules/student-office/student-office.module';
import { StudentQuestModule } from './modules/student-quest/student-quest.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

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
          autoIndex: false,
          connectionFactory: (connection) => {
            connection.plugin(paginator);

            Logger.log('Connected', 'Mongoose');

            return connection;
          },
        } as MongooseModuleOptions;
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          readyLog: true,
          config: [
            {
              isGlobal: true,
              url: configService.get('REDIS_URL'),
              password: configService.get('REDIS_PASSWORD'),
            },
          ],
        } as RedisModuleOptions;
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    MulterModule.register({
      dest: './storage/tmp',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(resolve('./'), 'storage/public'),
    }),
    AuthModule,
    ResetPasswordModule,
    UserModule,
    UploadModule,
    EmailModule,
    OfficeModule,
    QuestModule,
    StudentOfficeModule,
    StudentQuestModule,
    LeaderboardModule,
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
