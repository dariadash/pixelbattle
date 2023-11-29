import { Module } from '@nestjs/common';
import { FieldModule } from 'src/field/field.module';
import { UserModule } from 'src/user/user.module';
import { WebsocketGateway } from './websocket.gateway';

@Module({
    imports: [FieldModule, UserModule],
    providers: [WebsocketGateway],
})
export class WebsocketModule { }