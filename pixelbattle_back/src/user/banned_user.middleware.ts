import {
    Injectable, NestMiddleware,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { UserStatus } from './types';

type JwtPayload = {
    id: string,
    username: string
}

@Injectable()
export class BannedUserMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization
        if (!token) return
        const newToken = token.substring(7, token.length);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(newToken);

        if (!decodedJwtAccessToken) return
        const user = await this.userService.findOneById(Number(decodedJwtAccessToken.id))

        if (user.status === UserStatus.BANNED) {
            throw new HttpException('You are banned and not allowed to access this page.', HttpStatus.FORBIDDEN);
        }
        next();
    }
}