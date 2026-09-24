import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserStatusDTO } from './dto/update_user_status_dto';
import { TokenPairDto } from 'src/auth/dto/token-response.dto';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('users')
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({ description: 'User list' })
    getAllUsers() {
        return this.userService.findAll()
    }

    @Get('user/:email')
    @ApiOperation({ summary: 'Find user by email' })
    @ApiParam({ name: 'email', example: 'user@example.com' })
    @ApiOkResponse({ description: 'Found user' })
    @ApiBadRequestResponse({ description: 'User not found' })
    getUser(@Param('email') email: string) {
        return this.userService.findOne(email)
    }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ description: 'Access/refresh token pair. Refresh token is also set as httpOnly cookie.', type: TokenPairDto })
    @ApiBadRequestResponse({ description: 'Email already taken or validation failed' })
    async create(@Body() user: CreateUserDto, @Res() res: Response) {
        const userData = await this.userService.createUser(user)
        res.cookie(
            'refreshToken',
            userData.refresh_token,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' }
        )
        return res.json(userData)
    }

    @Put('user/:id')
    @ApiOperation({ summary: 'Update user by id' })
    @ApiParam({ name: 'id', example: '1' })
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ description: 'Update confirmation' })
    update(@Param('id') id: string, @Body() user: CreateUserDto) {
        this.userService.updateUser(id, user)
        return `User ${id} updated`
    }

    @Delete('user/:id')
    @ApiOperation({ summary: 'Delete user by id' })
    @ApiParam({ name: 'id', example: '1' })
    @ApiOkResponse({ description: 'Delete confirmation' })
    remove(@Param('id') id: string) {
        this.userService.deleteUser(id)
        return `User ${id} deleted`
    }

    @Patch('user/:id')
    @ApiOperation({ summary: 'Update user status (regular/admin/banned)' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiBody({ type: UpdateUserStatusDTO })
    @ApiOkResponse({ description: 'Update confirmation' })
    updateStatus(@Param('id') id: number, @Body() { newStatus }: UpdateUserStatusDTO) {
        this.userService.updateUserStatus(id, newStatus)
        return `User ${id} updated, status - ${newStatus}`
    }

    @Public()
    @Get('activate/:link')
    @ApiOperation({ summary: 'Activate account by email link' })
    @ApiParam({ name: 'link', description: 'Activation link from email' })
    @ApiOkResponse({ description: 'Redirects to frontend' })
    @ApiBadRequestResponse({ description: 'User not found' })
    async activateEmail(@Param('link') link: string, @Res() res: Response) {
        await this.userService.activate(link)
        return res.redirect(`${process.env.FRONT_URL}`)
    }
}
