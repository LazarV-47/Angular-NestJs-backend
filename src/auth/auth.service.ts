import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthJwtPayload } from './types/auth-Jwtpayload.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ){}


    async validateUser(username: string, password: string): Promise<AuthJwtPayload> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            const returnUser: AuthJwtPayload = {
                sub: user.id,
                username: user.username,
                email: user.email,
                picture: user.picture,
                role: user.role
            }
            return returnUser;
        }
        return null;
    }

    
    async login(user: AuthJwtPayload): Promise<string>{
        const token: string = this.jwtService.sign(user);
        return token;
    }


    async register(username: string, email: string, password: string, picture?: string): Promise<string> {       
        const existingUser = await this.userRepository.findOne({
            where: [
                { username: username }, 
                { email: email } 
            ]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                throw new HttpException('Username already exists', HttpStatus.CONFLICT);
            }
            if (existingUser.email === email) {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({ username, email, password: hashedPassword, picture});
        const savedUser = await this.userRepository.save(newUser);

        const loginUser: AuthJwtPayload = {
            sub: savedUser.id,
            username: savedUser.username,
            email: savedUser.email,
            picture: savedUser.picture,
            role: savedUser.role
        }

        return this.login(loginUser);
    }

    async getMe(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            select: ['id', 'username', 'email', 'picture'],
          });
    }
}
