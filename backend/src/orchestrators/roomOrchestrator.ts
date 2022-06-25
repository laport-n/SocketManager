import mongoose from 'mongoose';
import { RoomController } from '../controllers/roomController';
import { IRoom } from '../models/room.model';

export class RoomOrchestrator {
  public static instance: RoomOrchestrator;
  private roomController: RoomController;

  private constructor() {
    this.roomController = new RoomController();
  }

  public static getInstance(): RoomOrchestrator {
    if (!RoomOrchestrator.instance) {
      RoomOrchestrator.instance = new RoomOrchestrator();
    }
    return RoomOrchestrator.instance;
  }

  public async createNewRoom(
    userId: string,
    name: string,
    context: any,
    isPublic: boolean,
    invitedUsers: string[],
  ): Promise<IRoom> {
    return await this.roomController.saveOne(
      name,
      userId,
      context,
      isPublic,
      invitedUsers,
    );
  }

  public async getRoomById(
    roomId: string,
  ): Promise<Partial<IRoom> | IRoom | null> {
    return await this.roomController.findOneById(roomId);
  }

  public async getRooms(): Promise<Partial<IRoom>[] | IRoom[] | null> {
    return await this.roomController.find();
  }

  public async userJoin(roomId: string, userId: string): Promise<void> {
    await this.roomController.addNewEntryUser(roomId, userId);
  }

  public async findRoomByUsers(
    users: string[],
  ): Promise<Partial<IRoom> | null> {
    const eqToCheck = users.map(
      (userId) => new mongoose.Types.ObjectId(userId),
    );
    return await this.roomController.findOne({
      users: {
        $eq: eqToCheck,
      },
    });
  }
}
