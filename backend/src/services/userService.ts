import mongoose from 'mongoose';
import { ModelAcessController } from '../abstracts/abstractController';
import { IUser, UserModel } from '../models/user.model';

export class UserService extends ModelAcessController<IUser> {
  public model: any;
  constructor() {
    super();
    this.model = UserModel;
  }

  public async updateSession(
    userId: string,
    sessionId: mongoose.ObjectId
  ): Promise<void> {
    const filter = {
      _id: userId,
    };
    const query = {
      $push: {
        sessions: sessionId,
      },
    };
    await this.updateOne(filter, query);
  }

  public async updateIsOnline(
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    const filter = {
      _id: userId,
    };
    const query = {
      $set: {
        isOnline,
      },
    };
    await this.updateOne(filter, query);
  }
}
