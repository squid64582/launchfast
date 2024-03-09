import oauth2Client from '@/lib/google/oauth2'

export async function GET() {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'openid email profile',
    prompt: 'consent',
  })
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl,
    },
  })
}
