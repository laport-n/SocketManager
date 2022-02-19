import { ExtendedError } from "socket.io/dist/namespace";
import { JSONUtils } from "../../utils/JSONutils";
import { Redis } from "../redis/redis";
import { TSession } from "../redis/types/TSession";
import crypto from "crypto";

export class SocketManager {

    public static instance: SocketManager;
    private redis: Redis;

    private constructor(redis: Redis) {
        this.redis = redis;
    }

    public static getInstance(redis: Redis): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager(redis);
        }
        return SocketManager.instance;
    }

    public async authenticateSession(sessionID: string, socket: any, next: (err?: ExtendedError | undefined) => void): Promise<void> {
        if (!socket.handshake.auth.isPublic) {
            console.log(`PUBLIC_SESSION: ${sessionID} connecting`);
            if (sessionID) {
                await this.checkForExistingSession(sessionID, socket, next);
            }
            await this.createNewSession(sessionID, socket);
            return next();
        } else {
            // implémenter la vérification d'un access token
            // Avec les cetificats .pem
            console.log("NOT IMPLEMENTED YET");
        }
    }

    private async createNewSession(sessionID: string, socket: any): Promise<void> {
        console.log(`NOUVELLE SESSION_PUBLIC ${sessionID}`);
        socket.data.sessionID = sessionID ? sessionID : crypto.randomBytes(16).toString("hex");
        socket.data.userID = crypto.randomBytes(16).toString("hex");
        await this.redis.set(sessionID, JSON.stringify(socket.data));
        socket.emit('authenticated', { userID: socket.data.userID });
    }

    private async checkForExistingSession(sessionID: string, socket: any, next: (err?: ExtendedError | undefined) => void): Promise<void> {
        const sessionStringified = await this.redis.get(sessionID);
        let session: TSession;
        if (sessionStringified && JSONUtils.isParsable(sessionStringified)) {
            session = JSON.parse(sessionStringified) as TSession;
            if (session) {
                socket.data.sessionID = sessionID;
                socket.data.userID = session.userID;
                socket.emit('authenticated', { userID: socket.data.userID });
                return next();
            }
        }

    }
}