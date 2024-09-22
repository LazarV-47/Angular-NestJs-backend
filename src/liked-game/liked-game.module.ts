import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikedGameController } from './liked-game.controller';
import { LikedGameService } from './liked-game.service';
import { LikedGame } from 'src/typeorm/entities/likedGame';
import { User } from 'src/typeorm/entities/user.entity';
import { Game } from 'src/typeorm/entities/game.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LikedGame, User, Game])], 
    providers: [LikedGameService],
    controllers: [LikedGameController],
})
export class LikedGameModule {}
