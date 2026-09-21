import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FieldModule } from './field/field.module';
import { WebsocketModule } from './websocket/websocket.module';
import { TokenModule } from './token/token.module';

import { BannedUserMiddleware } from './user/banned_user.middleware';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { UserController } from './user/user.controller';
import { FieldController } from './field/field.controller';
import dataSource from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSource.options,
        migrationsRun: true,
      }),
    }),
    UserModule,
    AuthModule,
    FieldModule,
    WebsocketModule,
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