import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() authDto: AuthDto, @Res() res: Response) {
        const authData = await this.authService.signIn(authDto.email, authDto.password)
        res.cookie(
            'refreshToken',
            authData.refresh_token,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }
        )
        return res.json(authData)
    }

    @Post('logout')
    async signOut(@Req() req: Request, @Res() res: Response) {
        const { refreshToken } = req.cookies
        const token = await this.authService.signOut(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const { refreshToken } = req.cookies
        const authData = await this.authService.refresh(refreshToken)
        res.cookie(
            'refreshToken',
            authData.refresh_token,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }
        )
        return res.json(authData)
    }
}
