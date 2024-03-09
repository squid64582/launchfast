import { Redis } from '@upstash/redis'

let redis
if (import.meta.env['UPSTASH_REDIS_REST_URL'] && import.meta.env['UPSTASH_REDIS_REST_TOKEN']) {
  redis = new Redis({
    url: import.meta.env['UPSTASH_REDIS_REST_URL'],
    token: import.meta.env['UPSTASH_REDIS_REST_TOKEN'],
  })
}

export default redis
