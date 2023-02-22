import Joi from 'joi'

export const blamelessSchema = Joi.object({
    eventType: Joi.string().required(),
    incidentId: Joi.number().required(),
    followUpAction: Joi.string().optional()
})