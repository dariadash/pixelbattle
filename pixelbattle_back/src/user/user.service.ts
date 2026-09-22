import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create_user.dto";
import { UserStatus } from "./types";
import { TokenService } from "src/token/token.service";
import { RefreshTokenUserDataDto } from "./dto/reftoken_user_data.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private tokenService: TokenService,
        private jwtService: JwtService
    ) { }

    async findOne(email: string) {
        const user = await this.userRepository.createQueryBuilder('u')
            .where('email = :email', { email })
            .select(['u.username', 'u.userId', 'u.password', 'u.email', 'u.status', 'u.usernameColor', 'u.isActivated'])
            .getOne();
        if (!user) {
            throw new BadRequestException('User not found.')
        }
        return user
    }

    async findOneByUsername(username: string) {
        const user = await this.userRepository.createQueryBuilder('u')
            .where('username = :username', { username })
            .select(['u.username', 'u.userId', 'u.password', 'u.email', 'u.status', 'u.isActivated'])
            .getOne();
        if (!user) {
            throw new BadRequestException('User not found.')
        }
        return user
    }

    async findOneById(userId: number) {
        const user = await this.userRepository.findOneBy({ userId })

        if (!user) {
            throw new BadRequestException('User not found.')
        }
        return user
    }

    findAll() {
        return this.userRepository.find()
    }

    async createUser(user: CreateUserDto) {
        const candidate = await this.userRepository.findOneBy({ email: user.email })
        if (candidate) {
            throw new BadRequestException(`User with email ${user.email} already exist`)
        }
        user.activationLink = crypto.randomUUID()

        const salt = await genSalt()
        user.password = await hash(user.password, salt)
        await this.userRepository.insert(user)

        await this.tokenService.sendActivationMail(user.email, `${process.env.API_URL}/api/activate/${user.activationLink}`)

        const userDto = new RefreshTokenUserDataDto(user)
        const refreshToken = this.tokenService.generateRefreshToken({ ...userDto })
        await this.tokenService.updateRefreshToken(userDto.id, refreshToken)
        const accessToken = await this.jwtService.signAsync({
            id: userDto.id,
            username: user.username,
            status: UserStatus.REGULAR,
        })

        return { access_token: accessToken, refresh_token: refreshToken, user: userDto }
    }

    async updateUser(id: string, user: CreateUserDto) {
        const salt = await genSalt()
        user.password = await hash(user.password, salt)
        this.userRepository.update(id, user)
    }

    deleteUser(id: string): void {
        this.userRepository.delete(id);
    }

    async updateUserStatus(userId: number, newStatus: UserStatus): Promise<User> {
        const user = await this.userRepository.findOneBy({ userId });

        if (!user) {
            throw new BadRequestException('User not found.')
        }
        user.status = newStatus;
        return this.userRepository.save(user);
    }

    async activate(linkToActivation: string) {
        const user = await this.userRepository.findOneBy({ activationLink: linkToActivation })
        if (!user) {
            throw new BadRequestException(`User not found`)
        }

        user.isActivated = true;
        await this.userRepository.save(user)
    }
}