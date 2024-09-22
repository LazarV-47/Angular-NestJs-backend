import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/entities/game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { User } from 'src/typeorm/entities/user.entity';
import { Review } from 'src/typeorm/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User, Review])], 
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
