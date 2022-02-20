import { Server } from 'socket.io';
import { Redis } from '../modules/redis/redis';
import { config as redisConfig } from "../modules/redis/config";
import { config as mongoConfig } from "../modules/mongo/config";
import { Mongo } from '../modules/mongo/mongo';
import { EventController } from '../controllers/eventControllers';
import { SessionManager } from '../managers/sessionManager';
import * as Logger from "bunyan";
import { UserController } from '../controllers/userController';

export class SocketOrchestrator {
    public io;
    private log: any;
    private redis: Redis;
    private mongo: Mongo;
    private sessionManager: SessionManager;
    private eventController: EventController;
    private userController: UserController;

    constructor(server: any) {
        try {
            this.log = Logger.createLogger({ name: "SocketOrchestrator" });
            // Socket.io
            this.io = new Server(server);

            // Redis
            this.redis = new Redis(redisConfig);
            this.redis.connect();

            //Mongo
            this.mongo = new Mongo();
            this.mongo.connect(mongoConfig);

            // SocketManager
            this.sessionManager = SessionManager.getInstance(this.redis);

            //Controllers
            this.eventController = new EventController();
            this.userController = new UserController();

        } catch (err) {
            throw new Error(`[ERROR] error while starting the socketServer ${err}`)
        }
    }

    public listenersInitialization(listOfListenerMethods: (socket: any) => void) {

        this.io.use(async (socket, next) => {
            await this.sessionManager.authenticateSession(socket.handshake.query, socket, next, this.io);
        });

        this.io.on('connection', async (socket) => {
            this.log.info({ eventName: 'connection', sessionId: socket.data.sessionId }, 'USER_CONNECT');
            const eventId = await (await this.eventController.saveOne('connection', 'USER_CONNECT'))._id;
            await this.sessionManager.updateSession(socket.data.sessionId, eventId, 'connection');
            this.io.emit('user_connect', { userId: socket.data.userId });
            await this.userController.updateIsOnline(socket.data.userId, true);
            socket.onAny(async (eventName, ...args) => {
                this.log.info({ eventName, sessionId: socket.data.sessionId }, 'NEW EVENT');
                const eventId = await (await this.eventController.saveOne(eventName, JSON.stringify(args)))._id;
                await this.sessionManager.updateSession(socket.data.sessionId, eventId, eventName);
            });
            socket.on('disconnect', async () => {
                const eventName = 'disconnect';
                this.log.info({ eventName, sessionId: socket.data.sessionId }, 'USER_DISCONNECT');
                const eventId = await (await this.eventController.saveOne(eventName, 'USER_DISCONNECT'))._id;
                await this.sessionManager.updateSession(socket.data.sessionId, eventId, eventName);
                await this.userController.updateIsOnline(socket.data.userId, false);
                this.io.emit('user_disconnect', { userId: socket.data.userId });
            });
            listOfListenerMethods(socket);
        });
    }
}