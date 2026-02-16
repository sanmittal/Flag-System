import { redis } from "./redis";

const TTL = 30;

export async function getCache(key: string) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache(key: string, value: any) {
  await redis.set(key, JSON.stringify(value), "EX", TTL);
}

export async function invalidateFeatureCache(featureKey: string) {
  const keys = await redis.keys(`feature:${featureKey}:*`);
  if (keys.length > 0) {
    await redis.del(keys);
  }
}
