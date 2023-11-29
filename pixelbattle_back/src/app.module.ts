import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FieldModule } from './field/field.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { TokenModule } from './token/token.module';

import { User } from './user/user.entity';
import { Field } from './field/field.entity';
import { Post } from './post/post.entity';
import { Category } from './category/category.entity';
import { PostCategory } from './post/post_category.entity';
import { Token } from './token/token.entity';

import { BannedUserMiddleware } from './user/banned_user.middleware';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { UserController } from './user/user.controller';
import { FieldController } from './field/field.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Field, Post, Category, PostCategory, Token],
          migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
          synchronize: false,
          migrationsRun: true,
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    FieldModule,
    WebsocketModule,
    PostModule,
    CategoryModule,
    TokenModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BannedUserMiddleware)
      .exclude(
        { path: 'register', method: RequestMethod.POST },
        // { path: 'activate', method: RequestMethod.GET }
      )
      .forRoutes(UserController, FieldController, WebsocketGateway);
  }
}