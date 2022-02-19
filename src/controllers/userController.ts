import mongoose from "mongoose";
import { ModelAcessController } from "../abstracts/abstractController";
import { IUser, UserModel } from "../models/user.model";

export class UserController extends ModelAcessController<IUser> {
    public model: any;
    constructor() {
        super();
        this.model = UserModel;
    }

    public async saveOne(sessionId: mongoose.ObjectId, context: any = {}): Promise<IUser> {
        const userToSave: Partial<IUser> = {
            context,
            sessions: [ sessionId ],
        }
        return await this.save(userToSave);
    }
    
    public async updateSession(sessionId: mongoose.ObjectId, userId: string) {
        const filter = {
            _id: userId
        }
        const query = {
            $push: {
                sessions: sessionId
            }
        }
        await this.updateOne(filter, query);
    }
}