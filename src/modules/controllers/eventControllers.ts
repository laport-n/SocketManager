import { ModelAcessController } from '../abstracts/abstractController';
import { EventModel, IEvent } from '../mongo/model/event.model';

export class EventController extends ModelAcessController<IEvent> {
    public model: any;
    constructor() {
        super();
        this.model = EventModel;
    }

    public async saveOne(eventName: string, value: string): Promise<IEvent> {
        const eventToSave: Partial<IEvent> = {
            eventName,
            value,
            createdAt: new Date()
        }
        return await this.save(eventToSave);
    }
}