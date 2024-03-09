// Lemon Squeezy API Reference
// https://docs.lemonsqueezy.com/guides/tutorials/webhooks-logsnag
export async function POST({ request }) {
  try {
    const context = await request.json()
    const eventName = context['meta']['event_name']
    const obj = context['data']['attributes']
    const objId = context['data']['id']
    // Handle each event based on
    // https://docs.lemonsqueezy.com/guides/developer-guide/webhooks
    // Return a response to acknowledge receipt of the event
    return new Response('received', {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return new Response(null, {
      status: 500,
      statusText: e.message || e.toString(),
    })
  }
}
