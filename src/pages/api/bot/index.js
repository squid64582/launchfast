import { Bot, webhookCallback } from 'grammy'

const token = process.env.BOT_TOKEN
if (!token) throw new Error('BOT_TOKEN is unset')

const bot = new Bot(token)
bot.on('message:text', async (ctx) => {
  await ctx.reply('Echo: ' + ctx.message.text)
})

export const POST = webhookCallback(bot, 'sveltekit')
