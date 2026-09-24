import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from '@nestjs/jwt';
import { createTransport } from 'nodemailer';
import { Token } from "./token.entity";

@Injectable()
export class TokenService {
    private transporter = createTransport(
        {
            service: 'Gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        }
    )
    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
        private jwtService: JwtService
    ) {
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({
            where: { user: { userId } },
        })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return await this.tokenRepository.save(tokenData)
        }

        return await this.tokenRepository.save(
            this.tokenRepository.create({ user: { userId } as any, refreshToken })
        )
    }

    async removeToken(refreshToken: string) {
        if (!refreshToken) {
            return { affected: 0, raw: [] }
        }
        const tokenData = await this.tokenRepository.delete({ refreshToken: refreshToken })
        return tokenData
    }

    generateRefreshToken(payload: any) {
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' })
        return refreshToken
    }

    async findToken(refreshToken: string) {
        const tokenData = await this.tokenRepository.findOneBy({ refreshToken: refreshToken })
        return tokenData
    }
}