import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UseGuards(JwtAuthGuard)
    @Post('createReview/:gameId')
    async createReview(@Param('gameId') gameId: number, @Body() createReviewDto: CreateReviewDto, @Req() req) {
        return this.reviewService.createReview(gameId, createReviewDto, req.user.userId);
    }


    @UseGuards(JwtAuthGuard)
    @Patch('updateReview/:reviewId')
    updateReview(@Param('reviewId') reviewId: number, @Body() updateReviewDto: UpdateReviewDto, @Req() req) {
        return this.reviewService.updateReview(reviewId, updateReviewDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteReview/:reviewId')
    deleteReview(@Param('reviewId') reviewId: number, @Req() req) {
        return this.reviewService.deleteReview(reviewId, req.user.userId);
    }

}
