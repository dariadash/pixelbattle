import { Token } from 'src/token/token.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { UserStatus } from './types';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    username: string;

    @Index('email_index')
    @Column({
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        select: false,
    })
    password: string;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.REGULAR,
    })
    status: UserStatus;

    @Column({
        type: 'varchar',
        nullable: false
    })
    usernameColor: string

    @Column({
        type: 'boolean',
        default: false
    })
    isActivated: boolean

    @Column({
        type: 'varchar',
        nullable: true
    })
    activationLink: string | null;

    @OneToOne(() => Token, token => token.user)
    @JoinColumn({ name: 'userId' })
    token: Token;
}