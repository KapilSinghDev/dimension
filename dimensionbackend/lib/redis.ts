// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redis.on("connect", () => {
  console.log("redis successfully connected");
});
redis.on("error", () => {
  console.log("redis could not be connected");
});
async function testConnection() {
  try {
    const pong = await redis.ping();
    console.log(`Redis ping response: ${pong}`);
  } catch (error) {
    console.error("Failed to ping Redis:", error);
  }
}

export { redis, testConnection };
