import { model, Schema, Document, ObjectId, Types } from 'mongoose';

export interface IUser extends Document {
  isOnline: boolean;
  sessions: ObjectId[];
  socketId: string;
  context?: string;
}

export interface IUserDTO {
  isOnline: boolean;
  sessions: ObjectId[];
  socketId: string;
  context?: string;
}

export const UserSchema: Schema = new Schema({
  isOnline: { type: Boolean, requis: true, default: true },
  socketId: {
    type: String,
    required: true,
  },
  sessions: [
    {
      type: Types.ObjectId,
      ref: 'sessions',
    },
  ],
  context: { type: String, required: false },
});

export const UserModel = model<IUser>('User', UserSchema);
