import { model, Schema, Document, Types, ObjectId } from 'mongoose';

export interface ISession extends Document {
  startedAt: Date;
  updatedAt: Date;
  endedAt?: Date;
  events?: ObjectId[];
}

export const SessionSchema: Schema = new Schema({
  startedAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  endedAt: { type: Date, required: false },
  events: [
    {
      type: Types.ObjectId,
      ref: 'events',
    },
  ],
});

export const SessionModel = model<ISession>('Session', SessionSchema);
