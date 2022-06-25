import { IRoom, IRoomDTO } from '../models/room.model';
import { RoomService } from '../services/roomService';

export class RoomController {
  private readonly roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  public async saveOne(
    name: string,
    userId: string,
    context: any,
    isPublic = true,
    invitedUsers: string[],
  ): Promise<IRoom> {
    const roomToSave: IRoomDTO = {
      name,
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
      users: invitedUsers,
      context: { ...context },
      createdBy: userId,
    };
    return this.roomService.save(roomToSave);
  }

  public async findOneById(
    roomId: string,
  ): Promise<Partial<IRoom> | IRoom | null> {
    return this.roomService.findOneById(roomId);
  }

  public async findOne(
    query: { [key: string]: any } = {},
    projection: { [key: string]: number } = {},
  ): Promise<Partial<IRoom> | null> {
    return this.roomService.findOne(query, projection);
  }

  public async find(
    query: { [key: string]: any } = {},
    projection: { [key: string]: number } = {},
  ): Promise<Partial<IRoom>[] | IRoom[] | null> {
    return this.roomService.find(query, projection);
  }

  public async addNewEntryUser(roomId: string, userId: any): Promise<void> {
    await this.roomService.addNewEntryUser(roomId, userId);
  }
}
