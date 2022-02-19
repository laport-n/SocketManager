import { Server } from 'socket.io';
import { Redis } from '../redis/redis';
import { SocketManager } from '../socketManager/socketManager';
import { config as redisConfig } from "../../modules/redis/config";

export class SocketServer {
    private io;
    private redis: Redis;
    private socketManager: SocketManager;

    constructor(server: any) {
        try {
            this.io = new Server(server);
            this.redis = new Redis(redisConfig);
            this.redis.connect();
            this.socketManager = SocketManager.getInstance(this.redis);
        } catch (err) {
            throw new Error(`[ERROR] error while starting the socketServer ${err}`)
        }
    }

    public listenersInitialization(listOfListenerMethods: (socket: any) => void) {

        // Middleware d'authentication
        this.io.use(async (socket, next) => {
            const sessionID = socket.handshake.auth.sessionID;
            await this.socketManager.authenticateSession(sessionID, socket, next);
        });

        // Trouver comment attacher de façon dynamique des listeners
        this.io.on('connection', async (socket) => {
            socket.onAny((eventName, ...args) => {
            });
            listOfListenerMethods(socket);
        });
    }
}