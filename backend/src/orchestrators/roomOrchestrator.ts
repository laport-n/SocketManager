import * as Logger from 'bunyan';
import { RoomController } from '../controllers/roomController';
import { IRoom } from '../models/room.model';

export class RoomOrchestrator {
  public static instance: RoomOrchestrator;
  private log: any;
  private roomController: RoomController;

  private constructor() {
    this.log = Logger.createLogger({ name: 'RoomOrchestrator' });
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
    invitedUsers: string[]
  ): Promise<IRoom> {
    this.log.info({ userId, name, context }, 'New room created');
    return await this.roomController.saveOne(
      name,
      userId,
      context,
      isPublic,
      invitedUsers
    );
  }

  public async getRoomById(roomId: string): Promise<IRoom | null> {
    return await this.roomController.findOne(roomId);
  }

  public async getRooms(): Promise<IRoom[] | null> {
    return await this.roomController.find();
  }

  public async userJoin(roomId: string, userId: string): Promise<void> {
    await this.roomController.addNewEntryUser(roomId, userId);
  }
}
