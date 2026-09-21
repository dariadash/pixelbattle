import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { TokenService } from 'src/token/token.service';

import { UserService } from 'src/user/user.service';
import { getJwtSecret } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private tokenService: TokenService
    ) { }

    async signIn(username: string, pass: string) {
        const user = await this.userService.findOneByUsername(username)
        if (!user) {
            throw new BadRequestException('User with this username is not found')
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
            refresh_token: refreshToken,
            user: { id: user.userId, email: user.email, isActivated: user.isActivated },
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
        let userData: any;
        try {
            userData = await this.jwtService.verifyAsync(
                refToken, { secret: getJwtSecret() }
            );
        } catch {
            throw new UnauthorizedException('Refresh token expired or invalid')
        }
        const tokenFromDb = await this.tokenService.findToken(refToken)

        if (!userData || !tokenFromDb) {
            throw new UnauthorizedException('User is unauthorized')
        }

        let user;
        try {
            user = await this.userService.findOneById(userData.id)
        } catch {
            throw new UnauthorizedException('User is unauthorized')
        }

        const payload = { id: user.userId, username: user.username, status: user.status }
        const ref_payload = { id: user.userId, email: user.email, isActivated: user.isActivated }

        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = this.tokenService.generateRefreshToken(ref_payload)
        await this.tokenService.updateRefreshToken(user.userId, refreshToken)

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: { id: user.userId, email: user.email, isActivated: user.isActivated },
        };
    }
}
