import { Server } from 'socket.io';
import { Redis } from '../redis/redis';
import { SocketManager } from '../socketManager/socketManager';
import { config as redisConfig } from "../redis/config";
import { config as mongoConfig } from "../mongo/config";
import { Mongo } from '../mongo/mongo';
import { EventController } from '../controllers/eventControllers';
import { SessionController } from '../controllers/sessionController';

export class SocketWrapper {
    private io;
    private redis: Redis;
    private mongo: Mongo;
    private socketManager: SocketManager;
    private eventController: EventController;
    private sessionController: SessionController;

    constructor(server: any) {
        try {            
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

            //Controllers
            this.eventController = new EventController();
            this.sessionController = new SessionController();
        } catch (err) {
            throw new Error(`[ERROR] error while starting the socketServer ${err}`)
        }
    }

    public listenersInitialization(listOfListenerMethods: (socket: any) => void) {

        this.io.use(async (socket, next) => {
            const { sessionId } = socket.handshake.auth;
            await this.socketManager.authenticateSession(sessionId, socket, next);
        });

        this.io.on('connection', async (socket) => {
            socket.onAny(async (eventName, ...args) => {
                const eventId = await (await this.eventController.saveOne(eventName, JSON.stringify(args)))._id;
                await this.sessionController.updateSession(socket.data.sessionId, eventId, eventName);
            });
            listOfListenerMethods(socket);
        });
    }
}