import { ModelAcessController } from '../abstracts/abstractController';
import { IRoom, RoomModel } from '../models/room.model';
import mongoose from 'mongoose';

export class RoomService extends ModelAcessController<IRoom> {
  public model: any;
  constructor() {
    super();
    this.model = RoomModel;
  }

  public async addNewEntryUser(
    roomId: string,
    userId: mongoose.ObjectId,
  ): Promise<void> {
    const filter = {
      _id: roomId,
    };
    const query = {
      $set: {
        updatedAt: new Date(),
      },
      $addToSet: {
        users: userId,
      },
    };
    await this.updateOne(filter, query);
  }
}
