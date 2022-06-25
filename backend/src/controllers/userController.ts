import mongoose from "mongoose";
import { IUser } from "../models/user.model";
import { UserService } from "../services/userService";

export class UserController {
    public readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async saveOne(sessionId: mongoose.ObjectId, context: string): Promise<IUser> {
        const userToSave: Partial<IUser> = {
            context,
            isOnline: true,
            sessions: [ sessionId ],
        }
        return await this.userService.save(userToSave);
    }
    
    public async updateIsOnline(userId: string, isOnline: boolean): Promise<void> {
        await this.userService.updateIsOnline(userId, isOnline);
    }

    public async updateSession(sessionId: mongoose.ObjectId, userId: string) {
        await this.userService.updateSession(userId, sessionId);
    }

    public async findByUserId(userId: string): Promise<IUser | null> {
        return await this.userService.findOne(userId);
    }

    public async findAll(): Promise<IUser[] | null> {
        return await this.userService.find();
    }

    public async findAllWithoutSessions(): Promise<Partial<IUser[]> | null> {
        return await this.userService.find({}, { sessions: 0 });
    }
}