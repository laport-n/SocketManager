import { model, Schema, Document, Types } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
  createdBy: string;
  users: string[];
  context?: any;
  isPublic: boolean;
}

export interface IRoomDTO {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
  createdBy: string;
  users: string[];
  context?: any;
  isPublic: boolean;
}

export const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  createdBy: {
    type: Types.ObjectId,
    ref: 'users',
    required: true,
  },
  endedAt: { type: Date, required: false },
  users: [
    {
      type: Types.ObjectId,
      ref: 'users',
    },
  ],
  context: { type: Schema.Types.Mixed, required: false },
  isPublic: { type: Boolean, required: true, default: true },
});

export const RoomModel = model<IRoom>('Room', RoomSchema);
