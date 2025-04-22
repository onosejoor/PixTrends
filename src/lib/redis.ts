import Redis from "ioredis";

const redis = new Redis(
  "redis://default:83k0knZRtTgdNQoaJUOqzhUr7NT41dEl@redis-12185.c321.us-east-1-2.ec2.redns.redis-cloud.com:12185",
);

export default redis;
