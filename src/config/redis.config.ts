import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: (await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
          // password: process.env.REDIS_PASSWORD
        })) as any,
        
        ttl: 300 * 1000, // 5 minutes default TTL
        max: 100 // maximum number of items in cache
      })
    })
  ],
  exports: [CacheModule]
})
export class RedisCacheModule {}