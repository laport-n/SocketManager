import { model, Schema, Document } from 'mongoose';
import { IEvent, EventSchema } from './event.model';

export interface ISession extends Document {
  startedAt: Date;
  endedAt: Date;
  events?: IEvent[];
}

export const SessionSchema: Schema = new Schema({
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    events: { type: [EventSchema], required: false }
});

export const Session = model<ISession>('Session', SessionSchema);