import { HttpLoggerMiddleware } from './modules/telescope/middlewares/http-logger.middleware';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { resolve, join } from 'path';
import {
  Module,
  Logger,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
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
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { TelescopeModule } from './modules/telescope/telescope.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.' + (process.env.NODE_ENV ?? 'local'),
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('DB_URI'),
          useNewUrlParser: true,
          autoIndex: (process.env.NODE_ENV ?? 'local') !== 'local',
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
            },
          ],
        } as RedisModuleOptions;
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 300,
    }),
    MulterModule.register({
      dest: './storage/tmp',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(resolve('./'), 'storage/public'),
    // }),
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
    TelescopeModule,
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
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.configService.get('APP_DEBUG') !== 'true') {
      Logger.warn('Run with disabled telescope!');
      return;
    }

    Logger.log('Run with enabled telescope!');

    consumer
      .apply(HttpLoggerMiddleware)
      .exclude(
        '/healthcheck',
        '/favicon.ico',
        'upload/(.*)/file',
        'telescope(.*)',
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
