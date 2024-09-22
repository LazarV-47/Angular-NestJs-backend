import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/typeorm/entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { User } from 'src/typeorm/entities/user.entity';
import { Game } from 'src/typeorm/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Game, User])], 
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
