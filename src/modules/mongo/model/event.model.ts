import { model, Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    eventName: string,
    value: string,
    createdAt: Date,
}

export const EventSchema: Schema = new Schema({
    eventName: { type: String, required: true },
    value: { type: String, required: true },
    createAt: { type: Date, required: true}
});

export const Event = model<IEvent>('Event', EventSchema);