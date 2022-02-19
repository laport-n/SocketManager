import { ExtendedError } from "socket.io/dist/namespace";
import { JSONUtils } from "../utils/JSONutils";
import { Redis } from "../modules/redis/redis";
import { TSession } from "../modules/redis/types/TSession";
import * as Logger from "bunyan";
import { UserController } from "../controllers/userController";
import { EventController } from "../controllers/eventControllers";
import { SessionController } from "../controllers/sessionController";
import mongoose from "mongoose";

export class SessionOrchestrator {

    public static instance: SessionOrchestrator;
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

    public static getInstance(redis: Redis): SessionOrchestrator {
        if (!SessionOrchestrator.instance) {
            SessionOrchestrator.instance = new SessionOrchestrator(redis);
        }
        return SessionOrchestrator.instance;
    }

    public async authenticateSession(sessionId: string, socket: any, next: (err?: ExtendedError | undefined) => void): Promise<void> {
        if (!socket.handshake.auth.isPublic) {
            this.log.info(`PUBLIC_SESSION passed in the socket : ${sessionId} connecting`);
            if (sessionId) {
                if (await this.isSessionExist(sessionId, socket, next)) return next();
            }
            await this.createNewSession(socket);
            return next();
        } else {
            // implémenter la vérification d'un access token
            // Avec les cetificats .pem
            this.log.info("NOT IMPLEMENTED YET");
        }
    }

    private async createNewSession(socket: any): Promise<void> {
        const eventId = await (await this.eventController.saveOne('create new user', 'NOTHING'))._id;
        const sessionId = await (await this.sessionController.saveOne(eventId))._id;
        const userId = await (await this.userController.saveOne(sessionId, {...socket.context}))._id;
        socket.data.userId = userId;
        socket.data.sessionId = sessionId;
        this.log.info(`NEW PUBLIC_SESSION IS : ${socket.data.sessionId}`);
        await this.redis.set(sessionId.toString(), JSON.stringify(socket.data));
        this.log.info(socket.data, `REDIS SAVED`);
        socket.emit('authenticated', { ...socket.data });
    }

    private async isSessionExist(sessionId: string, socket: any, next: (err?: ExtendedError | undefined) => void): Promise<boolean> {
        const sessionStringified = await this.redis.get(sessionId);
        let session: TSession;
        if (sessionStringified && JSONUtils.isParsable(sessionStringified)) {
            session = JSON.parse(sessionStringified) as TSession;
            if (session) {
                const sessionDocument = await this.sessionController.findOne(sessionId);
                if (sessionDocument && !sessionDocument.endedAt) {
                    socket.data.sessionId = sessionId;
                } else {
                    const eventId = await (await this.eventController.saveOne('create new session', 'EXISTING_USER'))._id;
                    const sessionId = await (await this.sessionController.saveOne(eventId))._id;
                    socket.data.sessionId = sessionId;

                }
                socket.data.userId = session.userId;
                socket.emit('authenticated', { userId: socket.data.userId });
                return true;
            }
        }
        return false;
    }

    public async updateSession(sessionId: mongoose.ObjectId, eventId: string, eventName: string): Promise<void> {
        await this.sessionController.updateSession(sessionId, eventId, eventName);
    }
}