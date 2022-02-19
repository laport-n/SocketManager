import { ExtendedError } from "socket.io/dist/namespace";
import { JSONUtils } from "../../utils/JSONutils";
import { Redis } from "../redis/redis";
import { TSession } from "../redis/types/TSession";
import crypto from "crypto";
import * as Logger from "bunyan";

export class SocketManager {

    public static instance: SocketManager;
    private redis: Redis;
    private log: any;

    private constructor(redis: Redis) {
        this.redis = redis;
        this.log = Logger.createLogger({name: "SocketManager"});
    }

    public static getInstance(redis: Redis): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager(redis);
        }
        return SocketManager.instance;
    }

    public async authenticateSession(sessionId: string, socket: any, next: (err?: ExtendedError | undefined) => void): Promise<void> {
        if (!socket.handshake.auth.isPublic) {
            this.log.info(`PUBLIC_SESSION passed in the socket : ${sessionId} connecting`);
            if (sessionId) {
                if (await this.isSessionExist(sessionId, socket, next)) return next();
            }
            await this.createNewSession(sessionId, socket);
            return next();
        } else {
            // implémenter la vérification d'un access token
            // Avec les cetificats .pem
            this.log.info("NOT IMPLEMENTED YET");
        }
    }

    private async createNewSession(sessionId: string, socket: any): Promise<void> {
        sessionId = sessionId ? sessionId : `anonym_${crypto.randomBytes(16).toString("hex")}`;
        socket.data.sessionId = sessionId;
        this.log.info(`NEW PUBLIC_SESSION IS : ${socket.data.sessionId}`);
        socket.data.userID = crypto.randomBytes(16).toString("hex");
        this.log.info(socket.data, `REDIS SAVE`);
        await this.redis.set(sessionId, JSON.stringify(socket.data));
        socket.emit('authenticated', { ...socket.data });
    }

    private async isSessionExist(sessionId: string, socket: any, next: (err?: ExtendedError | undefined) => void): Promise<boolean> {
        const sessionStringified = await this.redis.get(sessionId);
        let session: TSession;
        if (sessionStringified && JSONUtils.isParsable(sessionStringified)) {
            session = JSON.parse(sessionStringified) as TSession;
            if (session) {
                socket.data.sessionId = sessionId;
                socket.data.userId = session.userId;
                socket.emit('authenticated', { userID: socket.data.userID });
                return true;
            }
        }
        return false;
    }
}