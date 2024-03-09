import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(import.meta.env.GOOGLE_AUTH_ID, import.meta.env.GOOGLE_AUTH_SECRET, import.meta.env.GOOGLE_AUTH_CALLBACK_URL)

export default oauth2Client
