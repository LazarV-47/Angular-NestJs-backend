import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';
import { Game } from './game.entity';
import { LikedGame } from './likedGame';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    picture: string;

    @Column({default: 'CONSUMER'})
    role: string;

    //Relations
    @OneToMany(() => LikedGame, (likedGame) => likedGame.user)
    likedGames: LikedGame[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

}
