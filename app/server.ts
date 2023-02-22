import { app } from 'app'
import { port } from 'config/env'
import { logger } from 'util/logger'


async function initializeServer(app): Promise<string> {
  logger.info('Starting Blameless Linear Integration API')

  // Start server
  app.listen(port, (): void => {
    logger.info('Server Listening', { port })
  })

  return 'Server Started Successfully'
}

initializeServer(app)
  .then(logger.info)
  .catch((err): void => {
    logger.error(err.message)
    process.exit(1)
  })

process.on('uncaughtExceptionMonitor', (error) => {
  logger.error('uncaught exception detected', {
    name: error.name,
    message: error.message,
    error,
  })
})
