import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LikedGameService } from './liked-game.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { retry } from 'rxjs';

@Controller('liked-game')
export class LikedGameController {
    constructor(private readonly likedGameService: LikedGameService) {}

    @UseGuards(JwtAuthGuard)
    @Post('add/:gameId')
    async addLikedGame(@Param('gameId') gameId: number, @Body('status') status: string, @Req() req) {
        return this.likedGameService.addLikedGame(gameId, status, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('updateStatus/:gameId')
    async updateLikedGameStatus(@Param('gameId') gameId: number,@Body('status') status: string,@Req() req) {
        return this.likedGameService.updateLikedGameStatus(gameId, status, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getLikedGames(@Req() req) {
        return this.likedGameService.getLikedGames(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('unlike/:gameId')
    async unlikeGame(@Param('gameId') gameId: number, @Req() req) {
      return this.likedGameService.unlikeGame(gameId, req.user.userId);
    }
}
