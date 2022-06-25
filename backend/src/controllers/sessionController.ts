import mongoose from 'mongoose';
import { ISession } from '../models/session.model';
import { SessionService } from '../services/sessionService';

export class SessionController {
  private readonly sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  public async saveOne(eventId: mongoose.ObjectId): Promise<ISession> {
    const sessionToSave: Partial<ISession> = {
      startedAt: new Date(),
      updatedAt: new Date(),
      events: [eventId],
    };
    return await this.sessionService.save(sessionToSave);
  }

  public async updateSession(
    sessionId: mongoose.ObjectId,
    eventId: string,
    eventName: string
  ) {
    switch (eventName) {
      case 'disconnect':
        await this.sessionService.addNewEntryAndCloseSession(
          sessionId,
          eventId
        );
        break;

      default:
        await this.sessionService.addNewEntry(sessionId, eventId);
        break;
    }
  }

  public async findOne(sessionId: string): Promise<ISession | null> {
    return await this.sessionService.findOne(sessionId);
  }
}
