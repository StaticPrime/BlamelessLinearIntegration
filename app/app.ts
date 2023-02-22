import Router from '@koa/router'
import cors from 'kcors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { logger } from 'util/logger'
import { v1Router } from 'routes/v1'

const app = new Koa()
const router = new Router()

// Apply CORS config
app.use(cors())

// Parse HTTP POST body
app.use(bodyParser())

// Global Error-Catching Middleware
app.use(async (ctx, next): Promise<void> => {
  try {
    await next()
  } catch (err) {
    ctx.app.emit('error', err, ctx)
  }
})

// Log errors through custom logger
app.on('error', (err): void => {
  logger.error(err.stack)
})

// Mount API routes
router.use('/v1', v1Router.routes(), v1Router.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

export { app }
