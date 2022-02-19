import { model, Schema, Document } from 'mongoose';
import { ISession, SessionSchema } from './session.model';

interface IUser extends Document {
  userId: string;
  sessions: ISession[];
  context?: any;
}

const UserSchema: Schema = new Schema({
    userId: { type: String, required: true },
    sessions: { type: [SessionSchema], required: true },
    context: { type: Schema.Types.Mixed, required: false }
});

export const User = model<IUser>('User', UserSchema);