import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";
import { User } from "./user.entity";
import { LikedGame } from "./likedGame";


@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    genre: string;

    @Column('text')
    description: string;

    @Column({nullable: true})
    picture: string;

    //Relations
    @OneToMany(() => LikedGame, (likedGame) => likedGame.game)
    likedGames: LikedGame[];

    @OneToMany(() => Review, (review) => review.game)
    reviews: Review[];
}