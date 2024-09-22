import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Game } from "./game.entity";


@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    //Relations
    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @ManyToOne(() => Game, (game) => game.reviews)
    game: Game;

}