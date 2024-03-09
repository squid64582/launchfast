import redis from '@/lib/db/upstash'
import isAdmin from '@/lib/utils/admin'

export async function POST({ request }) {
  // Parse the incoming form data from the 'request'
  const context = await request.formData()
  // Extract the 'email' from the form data
  const email = context.get('email')
  // Check if 'email' is missing in the form data
  if (!email) {
    // If 'email' is missing, return a 400 Bad Request response
    return new Response(null, { status: 400 })
  }
  // Check if the 'redis' module is available
  if (redis) {
    // Add the 'email' to the waitlist in Redis
    await redis.rpush('waitlist', email)
    // Return a successful response with a status code of 200
    return new Response(null, { status: 200 })
  }
  // If 'redis' is not available, return a 500 Internal Server Error response
  return new Response(null, { status: 500 })
}

export async function GET({ request }) {
  // Check if the requester is an admin
  if (!isAdmin(request)) {
    // If the requester is not an admin, return a 403 Forbidden response
    return new Response(null, { status: 403 })
  }
  // Check if the 'redis' module is available
  if (redis) {
    // Retrieve the waitlist from Redis
    const list = await redis.lrange('waitlist', 0, -1)
    // Return the waitlist as a JSON response with a status code of 200
    return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  // If 'redis' is not available, return a 500 Internal Server Error response
  return new Response(null, { status: 500 })
}
