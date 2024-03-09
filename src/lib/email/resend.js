import { Resend } from 'resend'

let resend
if (import.meta.env.RESEND_KEY) {
  resend = new Resend(import.meta.env.RESEND_KEY)
}

export default resend
