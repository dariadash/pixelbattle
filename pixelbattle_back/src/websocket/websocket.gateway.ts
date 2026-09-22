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

    private onlinePlayers = new Map<string, {
        socketId: string,
        name: string,
        color: string
    }>();

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
    }

    @SubscribeMessage('sendMessage')
    async handleChatSendMessage(client: Socket, data: {
        userId: number, text: string
    }): Promise<void> {
        const user = await this.userService.findOneById(data.userId)
        this.server.emit('userMessage', {
            username: user.username,
            text: data.text,
            color: user.usernameColor,
            socketId: client.id,
            isActivated: user.isActivated
        })
    }

    @SubscribeMessage('setColor')
    handleSetColor(@ConnectedSocket() client: Socket) {
        client.on('setColor', (newColor) => {
            client.broadcast.emit('newColor', {
                socketId: client.id,
                color: newColor
            })
        })
    }

    @SubscribeMessage('joinOnline')
    async joinOnline(client: Socket, data: { userId: number }): Promise<void> {
        const user = await this.userService.findOneById(data.userId)
        this.onlinePlayers.set(client.id, {
            socketId: client.id,
            name: user.username,
            color: user.usernameColor
        })
        this.server.emit('currentPlayers', [...this.onlinePlayers.values()]);
    }

    @SubscribeMessage('currentPlayers')
    currentPlayersList(@ConnectedSocket() client: Socket) {
        client.emit('currentPlayers', [...this.onlinePlayers.values()]);
    }

    @SubscribeMessage('message')
    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        console.log(`Connected ${client.id}`, args);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        console.log(`Disconnected: ${client.id}`);
        if (this.onlinePlayers.delete(client.id)) {
            this.server.emit('playerDisconnected', { socketId: client.id });
        }
    }

    afterInit() {
        this.server.emit('test', { do: 'stuff' });
    }
}