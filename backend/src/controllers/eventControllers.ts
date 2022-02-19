import { EventModel, IEvent } from '../models/event.model';
import { EventService } from '../services/eventService';

export class EventController {
    public model: any;
    private readonly eventService: EventService;

    constructor() {
        this.model = EventModel;
        this.eventService = new EventService();
    }

    public async saveOne(eventName: string, value: string): Promise<IEvent> {
        const eventToSave: Partial<IEvent> = {
            eventName,
            value,
            createdAt: new Date()
        }
        return this.eventService.save(eventToSave);
    }
}