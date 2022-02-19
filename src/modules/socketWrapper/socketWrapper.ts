import { Server } from 'socket.io';
import { Redis } from '../redis/redis';
import { SocketManager } from '../socketManager/socketManager';
import { config as redisConfig } from "../redis/config";
import * as Logger from "bunyan";

export class SocketWrapper {
    private io;
    private redis: Redis;
    private socketManager: SocketManager;
    private log: any;

    constructor(server: any) {
        try {
            this.log = Logger.createLogger({name: "socketWrapper"});
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

        this.io.on('connection', async (socket) => {
            socket.onAny((eventName, ...args) => {
                this.log.info("=========================")
                this.log.info("onAny", eventName, ...args);
            });
            listOfListenerMethods(socket);
        });
    }
}