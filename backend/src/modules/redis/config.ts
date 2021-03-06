import { RedisClientOptions, RedisScripts } from '@node-redis/client';

export const config: Omit<
  RedisClientOptions<never, RedisScripts>,
  'modules'
> = {
  url: process.env.SOCKET_REDIS_URL || 'redis://127.0.0.1:6379',
  socket: undefined, // RedisSocketOptions,
  username: process.env.SOCKET_REDIS_USERNAME || undefined,
  password: process.env.SOCKET_REDIS_PASSWORD || 'toto',
  name: process.env.SOCKET_REDIS_NAME || undefined,
  database: process.env.SOCKET_REDIS_DATABASE
    ? parseInt(process.env.SOCKET_REDIS_DATABASE)
    : undefined,
  commandsQueueMaxLength: process.env.SOCKET_REDIS_COMMANDS_QUEUE_MAX_LENGTH
    ? parseInt(process.env.SOCKET_REDIS_COMMANDS_QUEUE_MAX_LENGTH)
    : undefined,
  readonly: false,
  legacyMode: false,
  isolationPoolOptions: undefined, // PoolOptions
};
