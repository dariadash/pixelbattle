import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenPairDto } from './dto/token-response.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Log in with username and password' })
    @ApiBody({ type: AuthDto })
    @ApiOkResponse({ description: 'Access/refresh token pair. Refresh token is also set as httpOnly cookie.', type: TokenPairDto })
    @ApiBadRequestResponse({ description: 'User not found or incorrect password' })
    async signIn(@Body() authDto: AuthDto, @Res() res: Response) {
        const authData = await this.authService.signIn(authDto.username, authDto.password)
        res.cookie(
            'refreshToken',
            authData.refresh_token,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' }
        )
        return res.json(authData)
    }

    @Public()
    @Post('logout')
    @ApiOperation({ summary: 'Log out: revoke refresh token and clear cookie' })
    @ApiCookieAuth('refreshToken')
    @ApiOkResponse({ description: 'Revoked token info' })
    async signOut(@Req() req: Request, @Res() res: Response) {
        const { refreshToken } = req.cookies
        const token = await this.authService.signOut(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)
    }

    @Public()
    @Post('refresh')
    @ApiOperation({ summary: 'Rotate token pair using refreshToken cookie' })
    @ApiCookieAuth('refreshToken')
    @ApiOkResponse({ description: 'New access/refresh token pair. Refresh token cookie is rotated.', type: TokenPairDto })
    @ApiUnauthorizedResponse({ description: 'Missing, expired or unknown refresh token' })
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const { refreshToken } = req.cookies
        const authData = await this.authService.refresh(refreshToken)
        res.cookie(
            'refreshToken',
            authData.refresh_token,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' }
        )
        return res.json(authData)
    }
}
