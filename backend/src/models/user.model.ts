import { model, Schema, Document, ObjectId, Types } from 'mongoose';

export interface IUser extends Document {
  isOnline: boolean;
  sessions: ObjectId[];
  socketId?: ObjectId;
  context?: string;
}

export const UserSchema: Schema = new Schema({
    isOnline: { type: Boolean, requis: true, default: true },
    socketId: {
      type: Types.ObjectId,
      index: true,
      required: true,
      auto: true
    },
    sessions: [{
        type: Types.ObjectId,
        ref: 'sessions'
    }],
    context: { type: String, required: false }
});

export const UserModel = model<IUser>('User', UserSchema);