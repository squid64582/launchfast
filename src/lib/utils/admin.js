// A function to assess whether a user is admin based on the header value
export default function isAdmin(request) {
  // const session = getSession(request)
  const xAccessKey = request.headers.get('x-access-key')
  if (xAccessKey) {
    return xAccessKey === import.meta.env.PRIVATE_ACCESS_KEY
  }
  return false
}
