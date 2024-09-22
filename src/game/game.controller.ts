import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService){}

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard)
    @Post('createGame')
    @UseInterceptors(
        FileInterceptor('picture', {
            storage: diskStorage({
                destination: './uploads/game-cover', 
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const fileExt = extname(file.originalname);
                    callback(null, `${uniqueSuffix}${fileExt}`);
                },
            }),
        }),
    )
    async createGame(
        @Body() createGameDto: CreateGameDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const picturePath = file ? `/uploads/game-cover/${file.filename}` : null;
        return this.gameService.createGame(createGameDto, picturePath);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard)
    @Patch('updateGame/:id')
    @UseInterceptors(
        FileInterceptor('picture', {
            storage: diskStorage({
                destination: './uploads/game-cover',  // Folder inside Docker container
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const fileExt = extname(file.originalname);
                    callback(null, `${uniqueSuffix}${fileExt}`);
                },
            }),
        }),
    )
    async updateGame(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto, @UploadedFile() file: Express.Multer.File,) {
        const picturePath = file ? `/uploads/game-cover/${file.filename}` : null;
        return this.gameService.updateGame(id, updateGameDto, picturePath);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard)
    @Delete('deleteGame/:id')
    async deleteGame(@Param('id') id: number) {
        return this.gameService.deleteGame(id);
    }

    //Consumer methods start
    @UseGuards(JwtAuthGuard)
    @Get('findAllGames')
    async findAllGames() {
        return this.gameService.findAllGames();
    }

    @UseGuards(JwtAuthGuard)
    @Get('findGame/:id')
    async findGame(@Param('id') id: number) {
        return this.gameService.findGame(id);
    }

}
