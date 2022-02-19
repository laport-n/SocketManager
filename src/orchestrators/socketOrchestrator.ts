import { Server } from 'socket.io';
import { Redis } from '../modules/redis/redis';
import { SessionOrchestrator } from './SessionOrchestrator';
import { config as redisConfig } from "../modules/redis/config";
import { config as mongoConfig } from "../modules/mongo/config";
import { Mongo } from '../modules/mongo/mongo';
import { EventController } from '../controllers/eventControllers';

export class SocketOrchestrator {
    private io;
    private redis: Redis;
    private mongo: Mongo;
    private sessionOrchestrator: SessionOrchestrator;
    private eventController: EventController;

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
            this.sessionOrchestrator = SessionOrchestrator.getInstance(this.redis);

            //Controllers
            this.eventController = new EventController();
        } catch (err) {
            throw new Error(`[ERROR] error while starting the socketServer ${err}`)
        }
    }

    public listenersInitialization(listOfListenerMethods: (socket: any) => void) {

        this.io.use(async (socket, next) => {
            const { sessionId } = socket.handshake.auth;
            await this.sessionOrchestrator.authenticateSession(sessionId, socket, next);
        });

        this.io.on('connection', async (socket) => {
            socket.onAny(async (eventName, ...args) => {
                const eventId = await (await this.eventController.saveOne(eventName, JSON.stringify(args)))._id;
                await this.sessionOrchestrator.updateSession(socket.data.sessionId, eventId, eventName);
            });
            listOfListenerMethods(socket);
        });
    }
}