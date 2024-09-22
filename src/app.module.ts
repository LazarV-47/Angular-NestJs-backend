import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './typeorm/entities/user.entity';
import { Game } from './typeorm/entities/game.entity';
import { Review } from './typeorm/entities/review.entity';
import { GameModule } from './game/game.module';
import { ReviewModule } from './review/review.module';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LikedGameModule } from './liked-game/liked-game.module';
import { LikedGame } from './typeorm/entities/likedGame';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'game-tracker',
    entities: [User, Game, Review, LikedGame],
    synchronize: true,
  }), AuthModule, GameModule, ReviewModule, LikedGameModule,
    PassportModule.register({ defaultStrategy: 'jwt'}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Directory for uploaded images
      serveRoot: '/uploads',  // URL path for accessing images
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
