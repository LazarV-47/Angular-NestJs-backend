import { Body, Controller, Post, UseInterceptors, UploadedFile, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthJwtPayload } from './types/auth-Jwtpayload.dto';
//import { Express } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(@Body() body: { username: string, password: string}) {
        const user: AuthJwtPayload = await this.authService.validateUser(body.username, body.password);
        if(!user){
            throw new Error('Invalid creditentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    @UseInterceptors(
        FileInterceptor('picture', {
          storage: diskStorage({
            destination: './uploads/profile-pictures', 
            filename: (req, file, callback) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const fileExt = extname(file.originalname);
              callback(null, `${uniqueSuffix}${fileExt}`);
            },
          }),
        }),
      )
    async register(@Body() body: { username: string; email: string; password: string}, @UploadedFile() file: Express.Multer.File,) {
        const picturePath = file ? `/uploads/profile-pictures/${file.filename}` : null;
        return this.authService.register(body.username, body.email, body.password, picturePath);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req) {
      const user = req.user;
      return user;
      // return await this.authService.getMe(userId);
    }

}
