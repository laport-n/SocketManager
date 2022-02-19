import { ModelAcessController } from '../abstracts/abstractController';
import { EventModel, IEvent } from '../models/event.model';

export class EventService extends ModelAcessController<IEvent> {
    public model: any;
    constructor() {
        super();
        this.model = EventModel;
    }
}