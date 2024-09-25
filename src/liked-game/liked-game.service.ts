import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/typeorm/entities/game.entity';
import { LikedGame } from 'src/typeorm/entities/likedGame';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikedGameService {
    constructor(
        @InjectRepository(LikedGame)
        private likedGameRepository: Repository<LikedGame>,
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async addLikedGame(gameId: number, status: string, userId: number): Promise<LikedGame> {
        const game = await this.gameRepository.findOne({where: { id: gameId }});
        if (!game) {
            throw new NotFoundException('Game not found');
        }

        const user = await this.userRepository.findOne({where: { id: userId }});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const likedGame = await this.likedGameRepository.findOne({ where: { user: user, game: game } });

        if (likedGame) {
            throw new BadRequestException('You have already added this game to your list.');
        }

        const newLikedGame = this.likedGameRepository.create({ user, game, status });
        return await this.likedGameRepository.save(newLikedGame);
    }

    async updateLikedGameStatus(gameId: number, status: string, userId: number): Promise<LikedGame> {
        const user = await this.userRepository.findOne({where: { id: userId }});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const likedGame = await this.likedGameRepository.findOne({ where: { user: user, game: { id: gameId } }, relations: ['game'] });

        if (!likedGame) {
            throw new NotFoundException('Liked game entry not found.');
        }

        likedGame.status = status;
        await this.likedGameRepository.save(likedGame);

        return likedGame;
    }

    async getLikedGames(userId: number): Promise<LikedGame[]> {
        const user = await this.userRepository.findOne({where: { id: userId }});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.likedGameRepository.find({ where: { user: user }, relations: ['game', 'user'] });
    }


    async unlikeGame(gameId: number, userId: number): Promise<{ likedGameId: number }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
        throw new NotFoundException('User not found');
        }

        const likedGame = await this.likedGameRepository.findOne({
        where: { user: user, game: { id: gameId } },
        relations: ['game'],
        });

        if (!likedGame) {
            throw new NotFoundException('Liked game entry not found.');
        }
        const likedGameId = likedGame.id;

        await this.likedGameRepository.remove(likedGame);

        return { likedGameId };
    }

}
