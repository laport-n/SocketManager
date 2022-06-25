import { model, Schema, Document, ObjectId, Types } from 'mongoose';

export interface IRoom extends Document {
    name: string,
    createdAt: Date,
    updatedAt: Date,
    endedAt?: Date,
    users: ObjectId[],
    context?: any,
    isPublic: boolean
}

export const RoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true},
    updatedAt: { type: Date, required: true},
    endedAt: { type: Date, required: false},
    users: [{
        type: Types.ObjectId,
        ref: 'events'
    }],
    context: { type: Schema.Types.Mixed, required: false },
    isPublic: { type: Boolean, required: true, default: true }
});

export const RoomModel = model<IRoom>('Room', RoomSchema);