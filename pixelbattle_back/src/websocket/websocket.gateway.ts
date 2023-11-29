import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FieldService } from 'src/field/field.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class WebsocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private fieldService: FieldService,
        private userService: UserService
    ) { }

    @WebSocketServer()
    public server: Server;

    @SubscribeMessage('canvas-data')
    async handleMessage(client: Socket, data: {
        id: number,
        color: string,
        col: number,
        row: number
    }): Promise<void> {
        await this.fieldService.setPixel({
            fieldId: data.id,
            col: data.col,
            row: data.row,
            color: data.color,
            createdDate: new Date(),
        })
        this.server.emit('canvas-data', data);
        console.log(data, '!!! canvas-data !!!')
    }

    @SubscribeMessage('message')
    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        console.log(`Connected ${client.id}`, args);
    }

    @SubscribeMessage('sendMessage')
    handleChatSendMessage(@ConnectedSocket() client: Socket) {
        this.server.on('sendMessage', async (message) => {
            const user = await this.userService.findOneById(client.id as unknown as number)
            client.broadcast.emit('userMessage', {
                // username: this.worldService.players[client.id].name,
                username: user.username,
                text: message,
                // color: this.worldService.players[client.id].color,
                socketId: client.id,
            })
        })
    }

    @SubscribeMessage('setColor')
    handleSetColor(@ConnectedSocket() client: Socket) {
        client.on('setColor', (newColor) => {
            // this.worldService.players[client.id].color = newColor
            client.broadcast.emit('newColor', {
                socketId: client.id,
                color: newColor
            })
        })
    }

    @SubscribeMessage('currentPlayers')
    currentPlayersList(@ConnectedSocket() client: Socket) {
        client.emit('currentPlayers', this.userService.findAll());
    }

    afterInit() {
        console.log('WEBSOCKET GATEWAY SERVER INIT!!!!!!!!!');
        this.server.emit('test', { do: 'stuff' });
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        console.log(`Disconnected: ${client.id}`);
    }

}