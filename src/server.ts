import { buildApp } from './app'

const PORT = parseInt(process.env.PORT ?? '3000')
const HOST = process.env.HOST ?? '0.0.0.0'

async function start() {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    console.log(`🐟 Matsyakosh API running on http://${HOST}:${PORT}`)
    console.log(`📖 Health check: http://localhost:${PORT}/health`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()