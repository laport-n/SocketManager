import { Model } from "mongoose";

export abstract class ModelAcessController<T> {
    public abstract model: Model<T>;

    async save(document: any): Promise<T> {
        return this.model.create(document);
    }

    async findOne(id: string, projection: { [key: string]: number } | undefined = undefined): Promise<T | null> {
        if (projection) {
            return await this.model.findOne({_id: id}, { projection });
        }
        return await this.model.findOne({_id: id});
    }

    async find(query: any = {}, projection: { [key: string]: number } | undefined = undefined): Promise<T[] | null> {
        if (projection) {
            await this.model.find(query, projection)
        }
        return await this.model.find(query, projection);
    }

    async updateOne(filter: any, query: any): Promise<void> {
        await this.model.updateOne(filter, query);
    }
}