import { Server } from 'socket.io';
import { Redis } from '../redis/redis';
import { SocketManager } from '../socketManager/socketManager';
import { config as redisConfig } from "../redis/config";
import { config as mongoConfig } from "../mongo/config";
import * as Logger from "bunyan";
import { Mongo } from '../mongo/mongo';

export class SocketWrapper {
    private io;
    private redis: Redis;
    private mongo: Mongo;
    private socketManager: SocketManager;
    
    private log: any;

    constructor(server: any) {
        try {
            this.log = Logger.createLogger({name: "socketWrapper"});
            
            // Socket.io
            this.io = new Server(server);

            // Redis
            this.redis = new Redis(redisConfig);
            this.redis.connect();
            
            //Mongo
            this.mongo = new Mongo();
            this.mongo.connect(mongoConfig);

            // SocketManager
            this.socketManager = SocketManager.getInstance(this.redis);
        } catch (err) {
            throw new Error(`[ERROR] error while starting the socketServer ${err}`)
        }
    }

    public listenersInitialization(listOfListenerMethods: (socket: any) => void) {
        // Middleware d'authentication
        this.io.use(async (socket, next) => {
            const { sessionId } = socket.handshake.auth;
            await this.socketManager.authenticateSession(sessionId, socket, next);
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