import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/entities/game.entity';
import { Review } from 'src/typeorm/entities/review.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) {}


    async createGame(createGameDto: CreateGameDto, picturePath?: string): Promise<Game> {
        const newGame = this.gameRepository.create({
            ...createGameDto,
            picture: picturePath,
        });

        await this.gameRepository.save(newGame);
        return newGame;
    }

    async updateGame(id: number, updateGameDto: UpdateGameDto, picturePath?: string): Promise<Game> {
        const game = await this.gameRepository.findOne({ where: { id } });
        if (game) {
            if (updateGameDto.title) {
                game.title = updateGameDto.title;
            }
            if (updateGameDto.genre) {
                game.genre = updateGameDto.genre;
            }
            if (updateGameDto.description !== undefined) {
                game.description = updateGameDto.description;
            }
            if (picturePath) {
                game.picture = picturePath;
            }

            await this.gameRepository.save(game);

            return game;
        } else {
            throw new UnauthorizedException("Game not found");
        }
    }

    async deleteGame(id: number): Promise<Game> {
        const game = await this.gameRepository.findOne({ where: { id }, relations: ['reviews'] });
        if (game) {
            return await this.gameRepository.remove(game);
        } else {
            throw new UnauthorizedException("Game not found");
        }
    }

    //Consumer service methods
    async findAllGames(): Promise<Game[]> {
        return await this.gameRepository.find({ relations: ["reviews"]});
    }

    async findGame(id: number): Promise<Game> {
        return await this.gameRepository.findOne({ where: { id }, relations: ['reviews']});
    }

}
