import { ExtendedError } from "socket.io/dist/namespace";
import { JSONUtils } from "../utils/JSONutils";
import { Redis } from "../modules/redis/redis";
import { TSession } from "../modules/redis/types/TSession";
import { UserController } from "../controllers/userController";
import { EventController } from "../controllers/eventControllers";
import { SessionController } from "../controllers/sessionController";
import mongoose from "mongoose";
import * as Logger from "bunyan";

export class SessionManager {

    public static instance: SessionManager;
    private redis: Redis;
    private log: any;

    private userController: UserController;
    private sessionController: SessionController;
    private eventController: EventController;

    private constructor(redis: Redis) {
        this.redis = redis;
        this.log = Logger.createLogger({name: "SocketOrchestrator"});
        this.userController = new UserController();
        this.sessionController = new SessionController();
        this.eventController = new EventController();
    }

    public static getInstance(redis: Redis): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager(redis);
        }
        return SessionManager.instance;
    }

    public async authenticateSession(query: any, socket: any, next: (err?: ExtendedError | undefined) => void, io: any): Promise<void> {
        this.log
        if (!socket.handshake.auth.isPublic) {
            if (query.sessionId) {
                if (await this.isSessionExist(query, socket)) return next();
            }
            await this.createNewSession(query, socket, io);
            return next();
        } else {
            // implémenter la vérification d'un access token
            // Avec les cetificats .pem
            this.log.info("NOT IMPLEMENTED YET");
        }
    }

    private async createNewSession(query: any, socket: any, io: any): Promise<void> {
        const createUserEvent = await (await this.eventController.saveOne('create new user', 'USER_CREATE'))._id;
        const createSessionEventId = await (await this.eventController.saveOne('create new session', 'SESSION_CREATE'))._id;
        const sessionId = await (await this.sessionController.saveOne(createSessionEventId))._id;
        const { _id, socketId } = await (await this.userController.saveOne(sessionId, query.context));
        await this.sessionController.updateSession(sessionId, createUserEvent, 'USER_CREATE');
        socket.data.userId = _id;
        socket.data.sessionId = sessionId;
        socket.data.socketId = socketId;
        this.log.info(`NEW PUBLIC_SESSION : ${socket.data.sessionId}`);
        await this.redis.set(_id.toString(), JSON.stringify(socket.data));
        socket.emit('authenticated', { ...socket.data });
        io.emit('new_user', { username: JSON.parse(query.context).username });
    }

    private async isSessionExist(query: any, socket: any): Promise<boolean> {
        const sessionStringified = await this.redis.get(query.userId);
        let session: TSession;
        if (sessionStringified && JSONUtils.isParsable(sessionStringified)) {
            session = JSON.parse(sessionStringified) as TSession;
            if (session) {
                this.log.info(`EXISTING SESSION IN CACHE USER IS : ${session.userId}`);
                const sessionDocument = await this.sessionController.findOne(query.sessionId);
                if (sessionDocument && !sessionDocument.endedAt) {
                    socket.data.sessionId = query.sessionId;
                } else {
                    const eventId = await (await this.eventController.saveOne('create new session', 'SESSION_CREATE'))._id;
                    const sessionId = await (await this.sessionController.saveOne(eventId))._id;
                    socket.data.sessionId = sessionId;
                }
                socket.data.userId = session.userId;
                socket.data.socketId = session.socketId;
                await this.userController.updateSession(socket.data.sessionId, socket.data.userId );
                await this.redis.set(socket.data.userId.toString(), JSON.stringify(socket.data));
                socket.emit('authenticated', { ...socket.data });
                return true;
            }
        }
        return false;
    }

    public async updateSession(sessionId: mongoose.ObjectId, eventId: string, eventName: string): Promise<void> {
        await this.sessionController.updateSession(sessionId, eventId, eventName);
    }
}