import redis from '@/lib/db/upstash'
import { getSession } from '@/lib/utils/auth'

export async function GET({ request }) {
  // Check if the 'redis' module is available
  if (!redis) {
    // If 'redis' is not available, return a 500 Internal Server Error response
    return new Response(null, { status: 500 })
  }
  // Parse the URL from the 'request' object
  const url = new URL(request.url)
  // Extract the 'token' query parameter from the URL
  const token_from_url = url.searchParams.get('token')
  // Get the user session from the 'request'
  const session = getSession(request)
  // Check if a valid session exists
  if (session) {
    // Extract the 'email' property from the session
    const { email } = session
    // Check if 'email' exists
    if (email) {
      // Retrieve the stored token associated with the 'email' from the Redis database
      const token = await redis.hget('tokens', email)
      // Check if the retrieved token matches the 'token_from_url'
      if (token === token_from_url) {
        // If the tokens match, mark the user as approved in Redis
        await redis.hset('approved', { [email]: 1 })
        // Return a success response with a status code of 200
        return new Response('verified', {
          status: 200,
          headers: {
            Location: '/',
          },
        })
      }
      // If the tokens do not match, return an 'invalid token' response with a status code of 403
      return new Response('invalid token', {
        status: 403,
      })
    }
  }
  // If no valid session or email was found, return a 'could not verify' response with a status code of 500
  return new Response('could not verify', {
    status: 500,
  })
}
