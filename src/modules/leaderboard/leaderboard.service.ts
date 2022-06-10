import { AuthenticationService } from 'src/modules/auth/services/authentication.service';
import { Role, User } from 'src/modules/user/entities/user.entity';
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
    const start = (parseInt(paginationDto?.page ?? '1') - 1) * size;
    const stop = start + size - 1; //inclusive

    const usersScoresRedis =
      (await this.rebuildSortedSet()) ??
      (await this.redisService
        .getClient()
        .zrevrange(this.redisKey, start, stop, 'WITHSCORES'));

    const usersScores = {};
    for (let index = 0; index < usersScoresRedis.length; index += 2) {
      usersScores[usersScoresRedis[index]] = parseInt(
        usersScoresRedis[index + 1],
      );
    }

    const users = await this.userModel
      .find(
        { _id: { $in: Object.keys(usersScores) } },
        { profile: 1, firstName: 1, lastName: 1, student: 1 },
      )
      .lean()
      .exec();

    users.forEach((user: any) => {
      user.score = usersScores[user._id] ?? 0;
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

  async rebuildSortedSet() {
    if (await this.redisService.getClient().exists(this.redisKey)) {
      return null;
    }

    const users = await this.userModel.find(
      {
        role: Role.STUDENT,
        'student.officesCompleted.1': { $exists: true },
      },
      { 'student.officesCompleted': 1 },
    );
    console.log(users);

    const usersScores = users.flatMap((user) => [
      user.student.officesCompleted.length,
      user.id,
    ]);

    await this.redisService.getClient().zadd(this.redisKey, ...usersScores);

    return usersScores;
  }

  increment(userId: string, by = 1) {
    return this.redisService.getClient().zincrby(this.redisKey, by, userId);
  }
}
