import Koa from 'koa'
import * as returnCodes from 'util/return-codes'
import { ErrorType } from './api-errors'
import { logger } from './logger'
import { APIReturnPayload } from '../config/payload-types'

export const handleAPIResult = (ctx: Koa.Context, payload?: APIReturnPayload) => {
    payload = payload || { code: returnCodes.OK } as APIReturnPayload 
    ctx.status = payload.code
    ctx.body = payload
}

export const handleAPIError = (errorType: ErrorType, server_error: string, ctx: Koa.Context, dataDump?: any) => {
    logger.error(`API Error: ${server_error} ${ctx.request.method} ${ctx.request.url}`, 
    {
        error: server_error,
        dataDump
    })
    ctx.status = errorType.code
    ctx.body = errorType
}