import mongoose from "mongoose";
import { IUser, UserModel } from "../models/user.model";
import { UserService } from "../services/userService";

export class UserController {
    public model: any;
    public readonly userService: UserService;

    constructor() {
        this.model = UserModel;
        this.userService = new UserService();
    }

    public async saveOne(sessionId: mongoose.ObjectId, context: any = {}): Promise<IUser> {
        const userToSave: Partial<IUser> = {
            context,
            sessions: [ sessionId ],
        }
        return await this.userService.save(userToSave);
    }
    
    public async updateSession(sessionId: mongoose.ObjectId, userId: string) {
        await this.userService.updateSession(userId, sessionId);
    }
}