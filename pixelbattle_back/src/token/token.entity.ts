import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('token')
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false
    })
    refreshToken: string

    @OneToOne(() => User, user => user.token)
    @JoinColumn({ name: 'userId' })
    user: User;
}