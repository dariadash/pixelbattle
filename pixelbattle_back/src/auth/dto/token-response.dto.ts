import { ApiProperty } from '@nestjs/swagger';

export class PublicUserDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: false })
    isActivated: boolean;
}

export class TokenPairDto {
    @ApiProperty({ description: 'Short-lived JWT for API calls' })
    access_token: string;

    @ApiProperty({ description: 'Long-lived JWT stored in httpOnly refreshToken cookie' })
    refresh_token: string;

    @ApiProperty({ type: PublicUserDto })
    user: PublicUserDto;
}
