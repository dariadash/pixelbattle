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

const CHAT_MAX_LENGTH = 350
const CHAT_MIN_INTERVAL_MS = 1000
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

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

    private lastChatAt = new Map<string, number>();

    @SubscribeMessage('canvas-data')
    async handleMessage(client: Socket, data: {
        id: number,
        color: string,
        col: number,
        row: number
    }): Promise<void> {
        if (!Number.isInteger(data?.col) || !Number.isInteger(data?.row)
            || typeof data?.color !== 'string' || !HEX_COLOR_RE.test(data.color)) {
            return
        }
        const saved = await this.fieldService.setPixel({
            fieldId: data.id,
            col: data.col,
            row: data.row,
            color: data.color,
            createdDate: new Date(),
        })
        if (saved) {
            this.server.emit('canvas-data', data);
        }
    }

    @SubscribeMessage('sendMessage')
    async handleChatSendMessage(client: Socket, data: {
        userId: number, text: string
    }): Promise<void> {
        const text = typeof data?.text === 'string' ? data.text.trim() : ''
        if (!Number.isInteger(data?.userId) || !text || text.length > CHAT_MAX_LENGTH) {
            return
        }
        const now = Date.now()
        if (now - (this.lastChatAt.get(client.id) ?? 0) < CHAT_MIN_INTERVAL_MS) {
            return
        }
        this.lastChatAt.set(client.id, now)
        let user;
        try {
            user = await this.userService.findOneById(data.userId)
        } catch {
            return
        }
        this.server.emit('userMessage', {
            username: user.username,
            text,
            color: user.usernameColor,
            socketId: client.id,
            isActivated: user.isActivated
        })
    }

    @SubscribeMessage('setColor')
    async handleSetColor(client: Socket, data: { userId: number, color: string }): Promise<void> {
        if (!Number.isInteger(data?.userId) || typeof data?.color !== 'string' || !HEX_COLOR_RE.test(data.color)) {
            return
        }
        try {
            await this.userService.updateUsernameColor(data.userId, data.color)
        } catch {
            return
        }

        const entry = this.onlinePlayers.get(client.id)
        if (entry) {
            entry.color = data.color
        }
        this.server.emit('newColor', {
            socketId: client.id,
            color: data.color
        });
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
        this.lastChatAt.delete(client.id);
        if (this.onlinePlayers.delete(client.id)) {
            this.server.emit('playerDisconnected', { socketId: client.id });
        }
    }

    afterInit() {
        this.server.emit('test', { do: 'stuff' });
    }
}