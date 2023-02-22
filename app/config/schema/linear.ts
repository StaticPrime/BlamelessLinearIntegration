import Joi from 'joi'

export const linearSchema = Joi.object({
    action: Joi.string().required(),
    organizationId: Joi.string().required(),
    data: Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().optional(),
        priority: Joi.number().required(),
        assigneeId: Joi.string().optional(),
        stateId: Joi.string().required()
    }).required().options({ allowUnknown: true }),
    updatedFrom: Joi.object().optional()
}).options({ allowUnknown: true })