import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
    @ApiProperty({ example: 'player1' })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'secret123', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
