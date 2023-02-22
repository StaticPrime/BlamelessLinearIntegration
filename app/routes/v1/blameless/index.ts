import Router from '@koa/router'
import { isEmpty, clamp } from 'lodash'
import * as apiErrors from 'util/api-errors'
import { handleAPIError, handleAPIResult } from 'util/api-handler'
import { blamelessSchema } from 'config/schema/blameless'
import { IncidentPayload, NewLinearIssuePayload } from 'config/payload-types'
import * as BlamelessCtrl from 'controllers/blameless'
import * as IssueCreationCtrl from 'controllers/issue-creation'
import * as LinearCtrl from 'controllers/linear'
import { validateBodySchema, validateWebhookAction } from 'routes/middleware/validate'

const router = new Router()

router.post('/created', validateWebhookAction('incident.created'), validateBodySchema(blamelessSchema), async (ctx) => {
    try {
        const blamelessIncident = await BlamelessCtrl.getIncident(ctx.request.body['incidentId'])
        const incidentData: IncidentPayload = IssueCreationCtrl.formatBlamelessIncident(blamelessIncident)
        const incidentTasks: any[] = await BlamelessCtrl.getIncidentTasks(ctx.request.body['incidentId'])
        
        incidentData.description = IssueCreationCtrl.addChecklistFromBlameless(incidentData.description, incidentTasks)
        incidentData.description += `\nBlameless Incident ID: ${incidentData.id}\n`
        
        const newIssueTemplate: NewLinearIssuePayload = await IssueCreationCtrl.createLinearIssueTemplate(incidentData, 'Incident')
        const newLinearIssue: any = await LinearCtrl.createIssue(newIssueTemplate)

        await BlamelessCtrl.addLinearIssueToBlameless(newLinearIssue, newIssueTemplate.incident.id)
        await IssueCreationCtrl.attachLinks(newLinearIssue.id, newIssueTemplate)
        
        handleAPIResult(ctx)
    } catch (ex) {
        handleAPIError(apiErrors.SERVER_ERROR, ex.message, ctx, ex)
    }
})

router.post('/task-assigned', validateWebhookAction('incident.task_assigned'), validateBodySchema(blamelessSchema), async (ctx) => {
    try {
        const blamelessIncident: any = await BlamelessCtrl.getIncident(ctx.request.body['incidentId'])
        const linearIssue: any = await LinearCtrl.getIssueByBlamelessId(ctx.request.body['incidentId'])
        const incidentTasks: any[] = await BlamelessCtrl.getIncidentTasks(ctx.request.body['incidentId'])
        const newDescription = IssueCreationCtrl.addChecklistFromBlameless(blamelessIncident.summary, incidentTasks)
        
        await LinearCtrl.updateIssue(linearIssue.id, {description: newDescription})
        handleAPIResult(ctx)
    } catch (ex) {
        handleAPIError(apiErrors.SERVER_ERROR, ex.message, ctx, ex)
    }
})

router.post('/status-change', validateWebhookAction('incident.status_change'), validateBodySchema(blamelessSchema), async (ctx) => {
    try {
        const blamelessIncident: any = await BlamelessCtrl.getIncident(ctx.request.body['incidentId'])
        const linearIssue: any = await LinearCtrl.getIssueByBlamelessId(ctx.request.body['incidentId'])
        const blamelessLinearStatus: any = await LinearCtrl.getWorkflowStateByName(blamelessIncident.status)

        if (!isEmpty(blamelessLinearStatus)) {
            await LinearCtrl.updateIssueWorkflowState(linearIssue.id, blamelessLinearStatus.id)
        }
        
        handleAPIResult(ctx)
    } catch (ex) {
        handleAPIError(apiErrors.SERVER_ERROR, ex.message, ctx, ex)
    }
})

router.post('/severity-change', validateWebhookAction('incident.severity_change'), validateBodySchema(blamelessSchema), async (ctx) => {
    try {
        const blamelessIncident: any = await BlamelessCtrl.getIncident(ctx.request.body['incidentId'])
        const linearIssue: any = await LinearCtrl.getIssueByBlamelessId(ctx.request.body['incidentId'])
        const linearPriority = Number(blamelessIncident.severity.slice(-1)) + 1
        
        await LinearCtrl.updateIssue(linearIssue.id, {priority: clamp(linearPriority, 1, 4)})

        handleAPIResult(ctx)
    } catch (ex) {
        handleAPIError(apiErrors.SERVER_ERROR, ex.message, ctx, ex)
    }
})

router.post('/followup-action-created', validateWebhookAction('incident.followup_action_created'), validateBodySchema(blamelessSchema), async (ctx) => {
    try {
        const blamelessIncident: any = await BlamelessCtrl.getIncident(ctx.request.body['incidentId'])
        const blamelessFollowupAction: any = await BlamelessCtrl.getIncidentFollowUpAction(ctx.request.body['incidentId'], ctx.request.body['followUpAction'])
        const parentLinearIssue: any = await LinearCtrl.getIssueByBlamelessId(ctx.request.body['incidentId'])
      
        const incidentData: IncidentPayload = IssueCreationCtrl.formatBlamelessFollowUpAction(blamelessIncident, blamelessFollowupAction)                
        incidentData.description += `\nFollow Up Action ID: ${blamelessFollowupAction._id}\n`
        const newIssueTemplate: NewLinearIssuePayload = await IssueCreationCtrl.createLinearIssueTemplate(incidentData, 'Incident Follow Up Action')
        const newLinearIssue: any = await LinearCtrl.createIssue(newIssueTemplate)

        await LinearCtrl.updateIssue(newLinearIssue.id, {parentId: parentLinearIssue.id})
        await IssueCreationCtrl.attachLinks(newLinearIssue.id, newIssueTemplate)
    
        handleAPIResult(ctx)
    } catch (ex) {
        handleAPIError(apiErrors.SERVER_ERROR, ex.message, ctx, ex)
    }
})

export { router as blamelessRouter }