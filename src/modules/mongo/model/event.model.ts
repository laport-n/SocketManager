import { model, Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    eventName: string,
    value?: string,
    createdAt: Date,
}

export const EventSchema: Schema = new Schema({
    eventName: { type: String, required: true },
    value: { type: String, required: false },
    createdAt: { type: Date, required: true}
});

export const EventModel = model<IEvent>('Event', EventSchema);