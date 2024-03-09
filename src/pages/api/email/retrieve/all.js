import redis from '@/lib/db/upstash'
import isAdmin from '@/lib/utils/admin'

// A function to get list of all emails' ID sent
// Use this to extract each email via GET request to
// /email with the header 'x-email-id' of one of the IDs retrieved
export async function GET({ request }) {
  if (!isAdmin(request)) {
    return new Response(null, { status: 403 })
  }
  if (redis) {
    const list = await redis.lrange('emails', 0, -1)
    return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(null, { status: 500 })
}
