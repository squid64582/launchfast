import dotenv from 'dotenv'
dotenv.config()

import node from '@astrojs/node'
import netlify from '@astrojs/netlify'
import vercel from '@astrojs/vercel/serverless'

const netlifyAdapter = netlify()

const vercelAdapter = vercel({
  imageService: true,
  devImageService: 'sharp',
  webAnalytics: { enabled: true },
  speedInsights: { enabled: true },
})

const nodeAdapter = node({
  mode: 'standalone',
})

const adapters = {
  node: nodeAdapter,
  vercel: vercelAdapter,
  netlify: netlifyAdapter,
}

export const adapter = adapters[process.env.DEPLOYMENT_PLATFORM] ?? adapters['node']
