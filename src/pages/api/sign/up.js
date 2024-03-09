import redis from '@/lib/db/upstash'
import { getSession, getPassword, generateRandomString, signUp } from '@/lib/utils/auth'

export async function POST({ request }) {
  // Check if the 'redis' module is available
  if (!redis) {
    // If 'redis' is not available, return a 500 Internal Server Error response
    return new Response('Redis is not available.', { status: 500 })
  }
  // Parse the incoming form data from the 'request'
  const context = await request.formData()
  // Check if form data exists
  if (!context) {
    // If no form data is found, return a 400 Bad Request response
    return new Response('No user details submitted.', { status: 400 })
  }
  // Extract the user's email and password from the form data
  const userEmail = context.get('email')
  const userPassword = context.get('password')
  // Check if both email and password are provided
  if (!userEmail || !userPassword) {
    // If either email or password is missing, return a 400 Bad Request response
    return new Response('Please make sure both email and password are submitted.', { status: 400 })
  }
  // Get the user session from the 'request'
  const session = getSession(request)
  // Check if no session is found (user is not logged in)
  if (!session) {
    // Generate a randomized password based on the user's input password
    const randomizedPassword = generateRandomString(userPassword)
    // Attempt to retrieve the original password associated with the user's email
    const originalPassword = await getPassword(userEmail)
    // If the original password does not exist (user is not registered), proceed with sign-up
    if (!originalPassword) {
      // Call the 'signUp' function to register the user with the randomized password
      return await signUp(userEmail, randomizedPassword)
    } else {
      // If the password didn't match the earlier one
      // If a session is found (user is already logged in), return a redirect response with a status code of 302
      return new Response('There is a conflict with the current state of the resource.', { status: 409 })
    }
  } else {
    // If a session is found (user is already logged in), return a redirect response with a status code of 302
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    })
  }
}
