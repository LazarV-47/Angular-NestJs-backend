import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/entities/game.entity';
import { Review } from 'src/typeorm/entities/review.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}


    async createReview(gameId:number, createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
        throw new NotFoundException('User not found');
        }

        const game = await this.gameRepository.findOne({ where: { id: gameId }, relations: ['reviews']});
        if (!game) {
        throw new NotFoundException('Game not found');
        }

        const existingReview = await this.reviewRepository.findOne({ where: { user: user, game: game } });
        if (existingReview) {
            throw new BadRequestException('You have already reviewed this game.');
        }

        const review = this.reviewRepository.create({ ...createReviewDto, user, game });
        await this.reviewRepository.save(review);

        return await this.reviewRepository.findOne({
            where: { id: review.id },
            relations: ['game', 'user'],
        });
    }

    async updateReview(reviewId: number, updateReviewDto: UpdateReviewDto, userId: number): Promise<Review> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
        throw new NotFoundException('User not found');
        }

        const review = await this.reviewRepository.findOne({ where: { id: reviewId, user: user }});

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.reviewRepository.update(reviewId, {
            ...updateReviewDto,
            createdAt: new Date(),
        });

        return await this.reviewRepository.findOne({
            where: { id: reviewId },
            relations: ['game', 'user'],  // Include the 'game' and 'user' relations
        });
    }

    async deleteReview(reviewId: number, userId: number): Promise<Review> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
        throw new NotFoundException('User not found');
        }

        const review = await this.reviewRepository.findOne({ where: { id: reviewId, user: user } });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.reviewRepository.remove(review);
    }
    

    async getReviewsByGameId(gameId: number): Promise<Review[]> {
        return this.reviewRepository.find({
          where: { game: { id: gameId } },
          relations: ['game', 'user'],  // Load relations if necessary
        });
    }

    async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.find({
        relations: ['game', 'user'],  // Include game and user relations if needed
    });
    }
}
