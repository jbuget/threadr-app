import IORedis from 'ioredis';
import { Queue } from 'bullmq';

const connection = new IORedis(process.env.REDIS_URL as string);

const queue = new Queue('thread-schedules', { connection })

export { connection, queue }