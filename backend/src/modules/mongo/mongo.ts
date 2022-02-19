import { connect } from 'mongoose';
import * as Logger from "bunyan";

export class Mongo {
    private log: any;

    constructor() {
        this.log = Logger.createLogger({name: "Mongo"});
    }

    async connect(config: any) {
        try {
            await connect(config.url, config.options);
            this.log.info('Mongo connected');
        } catch (err) {
            this.log.error(err);
            throw new Error(`[ERROR] while trying to connect to mongo, ${err}`);

        }
    }
}