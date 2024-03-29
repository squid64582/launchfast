import redis from '@/lib/db/upstash'
import { getSession, generateRandomToken } from '@/lib/utils/auth'

export async function GET({ request }) {
  // Check if the 'redis' module is available
  if (!redis) {
    // If 'redis' is not available, return a 500 Internal Server Error response
    return new Response(null, { status: 500 })
  }
  // Get the user session from the 'request'
  const session = getSession(request)
  // Check if a valid session exists
  if (session) {
    // Extract the 'email' property from the session
    const { email, google } = session
    if (google && google === 1) {
      // Set the user as verified in DB
      // await redis.hset('approved', { [email]: 1 })
      // Return a success response with a status code of 200
      return new Response('verified', {
        status: 302,
        headers: {
          Location: '/',
        },
      })
    }
    if (email) {
      // Check if 'email' exists
      // Generate a random token
      const token = generateRandomToken()
      // Store the generated token in the Redis database associated with the 'email'
      await redis.hset('tokens', { [email]: token })
      // Construct the email verification URL
      const verificationUrl = `https://launchfast-astro-js.vercel.app/api/email/verify?token=${token}`
      // Send an email with the verification link to the user
      const emailResponse = await fetch(new URL('/api/email/trigger', new URL(request.url).origin).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-key': import.meta.env.PRIVATE_ACCESS_KEY,
        },
        body: JSON.stringify({
          to: email,
          subject: 'Verify email address',
          text: `Click the following link to verify your email address:\n${verificationUrl}`,
        }),
      })
      // Check if the email was sent successfully (HTTP status 200-299)
      if (emailResponse.ok) {
        // If the email was sent successfully, return a redirect response with a status code of 302
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
            'email-sent': true,
          },
        })
      }
    }
  }
  // If no valid session or email was found, return a redirect response with a status code of 302
  // and 'email-sent' set to false
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'email-sent': false,
    },
  })
}
