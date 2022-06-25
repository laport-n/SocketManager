import mongoose from 'mongoose';
import { ModelAcessController } from '../abstracts/abstractController';
import { ISession, SessionModel } from '../models/session.model';

export class SessionService extends ModelAcessController<ISession> {
  public model: any;
  constructor() {
    super();
    this.model = SessionModel;
  }

  public async addNewEntry(
    sessionId: mongoose.ObjectId,
    eventId: string
  ): Promise<void> {
    const filter = {
      _id: sessionId,
    };
    const query = {
      $set: {
        updatedAt: new Date(),
      },
      $push: {
        events: eventId,
      },
    };
    await this.updateOne(filter, query);
  }

  public async addNewEntryAndCloseSession(
    sessionId: mongoose.ObjectId,
    eventId: string
  ): Promise<void> {
    const filter = {
      _id: sessionId,
    };
    const query = {
      $set: {
        endedAt: new Date(),
        updatedAt: new Date(),
      },
      $push: {
        events: eventId,
      },
    };
    await this.updateOne(filter, query);
  }
}
