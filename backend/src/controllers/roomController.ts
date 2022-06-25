import { IRoom } from '../models/room.model';
import { RoomService } from '../services/roomService';

export class RoomController {
  private readonly roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  public async saveOne(
    name: string,
    userId: any,
    context: any,
    isPublic: boolean = true,
    invitedUsers: string[]
  ): Promise<IRoom> {
    const roomToSave: Partial<IRoom> = {
      name,
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [userId],
      context: { ...context },
    };
    return this.roomService.save(roomToSave);
  }

  public async findOne(roomId: string): Promise<IRoom | null> {
    return this.roomService.findOne(roomId);
  }

  public async find(): Promise<IRoom[] | null> {
    return this.roomService.find();
  }

  public async addNewEntryUser(roomId: string, userId: any): Promise<void> {
    await this.roomService.addNewEntryUser(roomId, userId);
  }
}
