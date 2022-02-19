import { model, Schema, Document, ObjectId, Types } from 'mongoose';

export interface IUser extends Document {
  sessions: ObjectId[];
  context?: any;
}

export const UserSchema: Schema = new Schema({
    sessions: [{
        type: Types.ObjectId,
        ref: 'sessions'
    }],
    context: { type: Schema.Types.Mixed, required: false }
});

export const UserModel = model<IUser>('User', UserSchema);