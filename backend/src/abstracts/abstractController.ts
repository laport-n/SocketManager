import { Model } from 'mongoose';
import * as Logger from 'bunyan';

export abstract class ModelAcessController<T> {
  public abstract model: Model<T>;
  private log: any = Logger.createLogger({ name: 'ModelAcessController' });

  async save(document: any): Promise<T> {
    this.log.info({ document }, 'New document to save');
    return this.model.create(document);
  }

  async findOneById(
    id: string,
    projection: { [key: string]: number } | undefined = undefined,
  ): Promise<Partial<T> | T | null> {
    if (projection) {
      return await this.model.findOne({ _id: id }, { projection });
    }
    return await this.model.findOne({ _id: id });
  }

  async findOne(
    query: any = {},
    projection: { [key: string]: number } | undefined = undefined,
  ): Promise<Partial<T> | T | null> {
    if (projection) {
      await this.model.findOne(query, projection);
    }
    return await this.model.findOne(query, projection);
  }

  async find(
    query: any = {},
    projection: { [key: string]: number } | undefined = undefined,
  ): Promise<Partial<T>[] | T[] | null> {
    if (projection) {
      await this.model.find(query, projection);
    }
    return await this.model.find(query, projection);
  }

  async updateOne(filter: any, query: any): Promise<void> {
    this.log.info({ filter, query }, 'New updateOne');
    await this.model.updateOne(filter, query);
  }
}
