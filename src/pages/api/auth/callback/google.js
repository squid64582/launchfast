import oauth2Client from '@/lib/google/oauth2'
import { createCookie } from '@/lib/utils/auth'

export async function GET({ request }) {
  const code = new URL(request.url).searchParams.get('code')
  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    const userCall = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const userInfo = await userCall.json()
    // {
    //   verified_email: true,
    //   name: 'Rishi Raj Jain',
    //   email: 'jain71000@gmail.com',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ4yjSGVhWDjRAzx2YZ_RCQ-lADhqG7OmRwi2Hu2I2gZFM=s96-c',
    // }
    const { email, name, picture, verified_email } = userInfo
    const cookie = createCookie({ email, name, picture, google: verified_email ? 1 : 0 })
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/api/email/verify/send',
        'Set-Cookie': `custom_auth=${cookie}; Path=/; HttpOnly`,
      },
    })
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}
