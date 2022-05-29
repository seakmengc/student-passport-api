import { AuthenticationService } from 'src/modules/auth/services/authentication.service';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, AuthenticationService],
  exports: [LeaderboardService, AuthenticationService],
})
export class LeaderboardModule {}
