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
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserStatusDTO } from './dto/update_user_status_dto';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('users')
    getAllUsers() {
        return this.userService.findAll()
    }

    @Get(':email')
    getUser(@Param('email') email: string) {
        return this.userService.findOne(email)
    }

    @Public()
    @Post('register')
    async create(@Body() user: CreateUserDto, @Res() res: Response) {
        const userData = await this.userService.createUser(user)
        res.cookie(
            'refreshToken',
            userData.refToken,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }
        )
        return res.json(userData)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() user: CreateUserDto) {
        this.userService.updateUser(id, user)
        return `User ${id} updated`
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        this.userService.deleteUser(id)
        return `User ${id} deleted`
    }

    @Patch('user/:id')
    updateStatus(@Param('id') id: number, @Body() { newStatus }: UpdateUserStatusDTO) {
        this.userService.updateUserStatus(id, newStatus)
        return `User ${id} updated, status - ${newStatus}`
    }

    @Public()
    @Get('activate/:link')
    async activateEmail(@Param('link') link: string, @Res() res: Response) {
        console.log(link)
        await this.userService.activate(link)
        return res.redirect(`${process.env.CLIENT_URL}/api`)
    }
}
