import { createClient, RedisClientOptions, RedisScripts } from 'redis';

export class Redis {
    private _client;
    
    constructor(config?: Omit<RedisClientOptions<never, RedisScripts>, "modules"> | undefined) {
        try {
            this._client = createClient(config);
            console.log('Redis created');
        } catch (err) {
            console.log(err);
            throw new Error(`[ERROR] while trying to createClient redis, ${err}`);
        }
    }

    public async connect(){
        try {
            if (this._client){
                await this._client.connect();
                console.log('Redis connect');
            } else {
            throw new Error(`[ERROR] the client is not created, can't connect to redis`);
            }
        } catch(err) {
            throw new Error(`[ERROR] failed to connect the client ${err}`);
        }
    }

    public async expire(key: string, second: number) {
        if (this._client){
            await this._client.expire(key, second)
        } else {
            throw new Error(`[ERROR] the client is not created, can't connect to redis`);
        } 
    }

    public async set(key: string, value: string) {
        if (this._client){
            await this._client.set(key, value);
        } else {
            throw new Error(`[ERROR] the client is not created, can't connect to redis`);
        }        
    }

    public async get(key: string) {
        if (this._client){
            return await this._client.get(key);
        } else {
            throw new Error(`[ERROR] the client is not created, can't connect to redis`);
        }        
    }

    get client(){
        return this._client;
    }

    set client(client){
        this._client = client;
    }

}