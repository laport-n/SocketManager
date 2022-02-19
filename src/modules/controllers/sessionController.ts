import mongoose from "mongoose";
import { ModelAcessController } from "../abstracts/abstractController";
import { ISession, SessionModel } from "../mongo/model/session.model";

export class SessionController extends ModelAcessController<ISession> {
    public model: any;
    constructor() {
        super();
        this.model = SessionModel;
    }

    public async saveOne(eventId: mongoose.ObjectId): Promise<ISession> {
        const sessionToSave: Partial<ISession> = {
            startedAt: new Date(),
            updatedAt: new Date(),
            events: [ eventId ]
        }
        return await this.save(sessionToSave);
    }

    public async updateSession(sessionId: mongoose.ObjectId, eventId: string, eventName: string) {
        const filter = {
            _id: sessionId
        }
        const query = eventName == 'disconnect' ? {
            $set: {
                endedAt: new Date(),
                updatedAt: new Date()
            },
            $push: {
                events: eventId
            }
        }: {
            $set: {
                updatedAt: new Date()
            },
            $push: {
                events: eventId
            }
        }
        await this.updateOne(filter, query);
    }
}