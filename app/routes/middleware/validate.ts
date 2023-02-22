import { Middleware } from '@koa/router'
import Koa from 'koa'
import Joi from 'joi'
import { isArray, isEmpty } from 'lodash'
import { handleAPIError } from 'util/api-handler'
import * as errors from 'util/api-errors'
import { linearConfig } from 'config/env'

const handleValidationFailure = (error_message: string, ctx: Koa.Context) => {
  handleAPIError(errors.BAD_REQUEST('Validation Failed'), `Validation Failure: ${error_message}`, ctx, ctx.request.body)
}

export const validateWebhookAction = (eventType: string | string[]): Middleware => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      if (!isArray(eventType)) {
        eventType = [eventType]
      }
      const eventRequested = ctx.request.body['eventType']
      if (eventType.includes(eventRequested)) {
        return next()
      } else {
        handleAPIError(errors.BAD_REQUEST('Invalid Event Type Provided'), 'Event Type Validation Failure', ctx)
      }
    } catch (ex) {
      handleAPIError(errors.BAD_REQUEST('Invalid Event Type Provided'), ex.message, ctx, ex)
    }
  }
}

export const validateBodySchema = (schemaToValidate: Joi.Schema): Middleware => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      if (!isEmpty(ctx.request.body)) {
        const result = schemaToValidate.validate(ctx.request.body)

        if (result.error) {
          handleValidationFailure(result.error.toString(), ctx)
        } else {
          return next()
        }
      } else {
        handleAPIError(errors.BAD_REQUEST('No Payload Provided'), 'Validation Failure', ctx)
      }
    } catch (ex) {
      handleValidationFailure(ex.message, ctx)
    }
  }
}