import { AuthPayload } from './../../decorators/auth-payload.decorator';
import { LeaderboardService } from './leaderboard.service';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { Controller, Get } from '@nestjs/common';
import { AllowUnauth } from 'src/decorators/allow-unauth.decorator';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @AllowUnauth()
  findAll(paginationDto: PaginationDto) {
    return this.leaderboardService.findAll(paginationDto);
  }

  @Get('/me')
  getMyRank(@AuthPayload() payload) {
    return this.leaderboardService.getMyRank(payload);
  }
}
