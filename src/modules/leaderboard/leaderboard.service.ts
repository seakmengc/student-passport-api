import { AuthenticationService } from 'src/modules/auth/services/authentication.service';
import { User } from 'src/modules/user/entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeaderboardService {
  private redisKey = 'leaderboard';

  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private authenticationService: AuthenticationService,
    private configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const size = 15;
    const start = (parseInt(paginationDto.page) - 1) * size;
    const stop = start + size - 1; //inclusive

    const userIds = await this.redisService
      .getClient()
      .zrevrange(this.redisKey, start, stop, 'WITHSCORES');

    const users = await this.userModel
      .find(
        { _id: { $in: userIds } },
        { profile: 1, firstName: 1, lastName: 1, student: 1 },
      )
      .lean()
      .exec();

    const profileIds = users
      .filter((user) => user.profile)
      .map((user) => user.profile.id);
    const signature =
      await this.authenticationService.generateSignatureForUploads(profileIds);
    const baseUrl = this.configService.get('APP_URL');

    users.forEach((user) => {
      if (user.profile) {
        user.profileUrl = `https://avatars.dicebear.com/api/avataaars/${user.firstName}.svg`;
        return;
      }

      user.profileUrl = `${baseUrl}/upload/${user.profile}/file?sig=${signature}`;
    });

    return users;
  }

  async getMyRank(userId: string) {
    const rank = await this.redisService
      .getClient()
      .zrevrank(this.redisKey, userId);

    const score = await this.redisService
      .getClient()
      .zscore(this.redisKey, userId);

    return { rank, score };
  }

  // async rebuildSortedSet() {
  //   const users = await this.userModel.find(
  //     {
  //       role: Role.STUDENT,
  //       student: {
  //         officesCompleted: { $exists: true },
  //       },
  //     },
  //     { 'student.officesCompleted': 1 },
  //   );
  // }

  increment(userId: string, by = 1) {
    return this.redisService.getClient().zincrby(this.redisKey, by, userId);
  }
}
