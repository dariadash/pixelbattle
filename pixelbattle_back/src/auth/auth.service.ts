import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { TokenService } from 'src/token/token.service';

import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private tokenService: TokenService
    ) { }

    async signIn(email: string, pass: string) {
        const user = await this.userService.findOne(email)
        if (!user) {
            throw new BadRequestException('User with this email is not found')
        }

        if (!await compare(pass, user?.password)) {
            throw new BadRequestException('Incorrect password')
        }

        const payload = { id: user.userId, username: user.username, status: user.status }
        const ref_payload = { id: user.userId, email: user.email, isActivated: user.isActivated }

        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = this.tokenService.generateRefreshToken(ref_payload)
        await this.tokenService.updateRefreshToken(user.userId, refreshToken)

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    async signOut(refToken: string) {
        const token = await this.tokenService.removeToken(refToken)
        return token
    }

    async refresh(refToken: string) {
        if (!refToken) {
            throw new UnauthorizedException('User is unauthorized')
        }
        const userData = await this.jwtService.verifyAsync(
            refToken, { secret: jwtConstants.secret }
        );
        const tokenFromDb = await this.tokenService.findToken(refToken)

        if (!userData || !tokenFromDb) {
            throw new UnauthorizedException('User is unauthorized')
        }


        const user = await this.userService.findOneById(userData.id)

        const payload = { id: user.userId, username: user.username, status: user.status }
        const ref_payload = { id: user.userId, email: user.email, isActivated: user.isActivated }

        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = this.tokenService.generateRefreshToken(ref_payload)
        await this.tokenService.updateRefreshToken(user.userId, refreshToken)

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
}
