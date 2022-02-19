import { Model } from "mongoose";

export abstract class ModelAcessController<T> {
    public abstract model: Model<T>;

    async save(document: any): Promise<T> {
        return this.model.create(document);
    }

    async findOne(id: string): Promise<T | null> {
        return await this.model.findOne({_id: id});
    }

    async find(query: any): Promise<T[] | null> {
        return await this.model.find(query);
    }

    async updateOne(filter: any, query: any): Promise<void> {
        await this.model.updateOne(filter, query);
    }
}