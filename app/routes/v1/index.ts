import Router from '@koa/router'
import { blamelessRouter } from './blameless'

const v1Router = new Router()

v1Router.use('/blameless', blamelessRouter.routes(), blamelessRouter.allowedMethods())

export { v1Router }