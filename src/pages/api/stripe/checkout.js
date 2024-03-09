import Stripe from 'stripe'
import { parseCookies } from '@/lib/utils/auth'

export async function POST({ request }) {
  const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY
  if (!STRIPE_SECRET_KEY) {
    return new Response(null, {
      status: 500,
    })
  }
  let metadata = {}
  const cookies = parseCookies(request.headers.get('Cookie'))
  if (cookies && cookies['reflioData']) {
    try {
      const tmp = JSON.parse(cookies['reflioData'])
      metadata = { reflio_referral_id: tmp['referral_id'] }
    } catch (e) {}
  }
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' })
  const session = await stripe.checkout.sessions.create({
    metadata,
    mode: 'payment',
    payment_method_configuration: 'pmc_1O2qH3SE9voLRYpuz5FLmkvn',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product: 'prod_OqWkk7Rz9Yw18f',
          unit_amount: Math.round(150 * 100),
        },
      },
    ],
    discounts: [
      {
        coupon: 'M0OTIWMA',
      },
    ],
    custom_fields: [
      {
        type: 'text',
        key: 'github',
        optional: true,
        label: {
          type: 'custom',
          custom: 'GitHub Username',
        },
      },
    ],
    cancel_url: 'https://www.launchfa.st',
    success_url: 'https://www.launchfa.st',
  })
  return new Response(null, {
    status: 303,
    headers: {
      Location: session.url,
    },
  })
}
