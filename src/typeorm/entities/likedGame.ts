import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Game } from "./game.entity";


@Entity()
export class LikedGame {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.likedGames, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Game, (game) => game.likedGames, { onDelete: 'CASCADE' })
    game: Game;

    @Column()
    status: string;
}