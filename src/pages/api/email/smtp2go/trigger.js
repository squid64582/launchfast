import nodemailer from 'nodemailer'
import isAdmin from '@/lib/utils/admin'

export async function POST({ request }) {
  // Parse the JSON data from the request body
  const context = await request.json()
  // Check if the 'nodemailer' module is available
  if (!nodemailer) {
    // If 'nodemailer' is not available, return a 500 Internal Server Error response
    return new Response(null, { status: 500 })
  }
  // Check if the requester is an admin
  if (!isAdmin(request)) {
    // If the requester is not an admin, return a 403 Forbidden response
    return new Response(null, { status: 403 })
  }
  // Send an email using nodemailer
  // https://www.smtp2go.com/setupguide/node-js-script/
  const smtpTransport = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    auth: {
      user: import.meta.env.SMTP2GO_USERNAME,
      pass: import.meta.env.SMTP2GO_PASSWORD,
    },
    port: 2525, // 8025, 587 and 25 can also be used.
  })

  smtpTransport.sendMail({
    text: context.text,
    subject: context.subject,
    from: context['verified_sender'] ?? 'jain71000@gmail.com',
    to: typeof context.to === 'string' ? [context.to] : context.to,
  })

  // Return a successful response with a status code of 200
  return new Response(null, { status: 200 })
}
