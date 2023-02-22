import { blamelessConfig, linearConfig } from 'config/env'
import { linearClient } from 'util/linear-client'
import * as LinearCtrl from 'controllers/linear'
import { IncidentPayload, NewLinearIssuePayload } from 'config/payload-types'
import { isEmpty, clamp } from 'lodash'
import { logger } from 'util/logger'
import { getPriority } from 'util/priorities'

export const formatBlamelessIncident = (blamelessIncident: any): IncidentPayload => {
    try {
        const formattedIssue: IncidentPayload = {
            id: String(blamelessIncident._id),
            title: blamelessIncident.description,
            description: blamelessIncident.summary,
            severity: Number(getPriority(blamelessIncident.severity)),
            url: `https://${blamelessConfig.hostName}/incidents/${blamelessIncident._id}/events`,
            videoConferenceUrl: blamelessIncident.bridge.url,
            retrospectiveUrl: `https://${blamelessConfig.hostName}/retrospective/${blamelessIncident._id}`,
            slackUrl: blamelessIncident.slack_channel.url,
            slackChannel: blamelessIncident.slack_channel.name,
            commanderEmail: findCommanderFromBlameless(blamelessIncident)
        }
        return formattedIssue
    } catch (ex) {
        logger.error(`Error formatting Blameless Incident ${blamelessIncident}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    }
}

export const formatBlamelessFollowUpAction = (blamelessIncident: any, blamelessFollowUpAction: any): IncidentPayload => {
    try {
        const formattedIssue: IncidentPayload = {
            id: String(blamelessIncident._id),
            title: blamelessFollowUpAction.summary,
            description: blamelessFollowUpAction.summary,
            severity: Number(getPriority(blamelessIncident.severity)),
            url: `https://${blamelessConfig.hostName}/incidents/${blamelessIncident._id}/events`,
            videoConferenceUrl: blamelessIncident.bridge.url,
            retrospectiveUrl: `https://${blamelessConfig.hostName}/retrospective/${blamelessIncident._id}`,
            slackUrl: blamelessIncident.slack_channel.url,
            slackChannel: blamelessIncident.slack_channel.name,
            commanderEmail: findCommanderFromBlameless(blamelessIncident)
        }
        return formattedIssue
    } catch (ex) {
        logger.error(`Error formatting Blameless Follow Up Action ${blamelessIncident}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    }
}

export const addChecklistFromBlameless = (issueDescription: string, incidentTasks: any[]): string => {
    let checklistDescription = '\n'
    
    if (!isEmpty(incidentTasks)) {
        incidentTasks.forEach((task) => {
            checklistDescription += `* [${task.complete ? 'X' : ' '}] ${task.description}\n`
        })
    }
    return issueDescription.concat(checklistDescription)
}

export const createLinearIssueTemplate = async (incidentData: IncidentPayload, labelName?: string): Promise <NewLinearIssuePayload> => {
    try {
        const linearIncidentLabelId: string = await LinearCtrl.getLabelId(isEmpty(labelName) ? 'Incident' : labelName)
        const linearUserId: string = await LinearCtrl.getUserIdByEmail(incidentData.commanderEmail)
        const newLinearIssue: NewLinearIssuePayload = {
            issue: {
                title: `INCIDENT ${incidentData.id} - ${incidentData.title}`,
                description: incidentData.description,
                teamId: linearConfig.defaultTeamId,
                priority: clamp(incidentData.severity, 1, 4),
                projectId: linearConfig.defaultProjectId,
                labelIds: [linearIncidentLabelId],
                assigneeId: linearUserId
            },
            incident: {
                id: incidentData.id,
                url: incidentData.url,
                slackChannel: incidentData.slackChannel,
                slackURL: incidentData.slackUrl,
                videoConferenceURL: incidentData.videoConferenceUrl,
                retrospectiveURL: incidentData.retrospectiveUrl
            }
        }
        return newLinearIssue
    } catch (ex) {
        logger.error(`Error creating Linear Issue Template: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    }
}

export const attachLinks = async (linearId: string, linearData: NewLinearIssuePayload): Promise <void> => {
    await linearClient.attachmentLinkURL(linearId, linearData.incident.url, {title: `Blameless Incident`})
    await linearClient.attachmentLinkURL(linearId, linearData.incident.slackURL, {title: `Slack Channel #${linearData.incident.slackChannel}`})
    await linearClient.attachmentLinkURL(linearId, linearData.incident.videoConferenceURL, {title: 'Video Conference'})
    await linearClient.attachmentLinkURL(linearId, linearData.incident.retrospectiveURL, {title: 'Retrospective'})
}

const findCommanderFromBlameless = (blamelessIssue: any): string => {
    try {
        let commanderEmail = ''
        if (!isEmpty(blamelessIssue.team)) {
            blamelessIssue.team.forEach((team: any) => {
                if (!isEmpty(team.roles) && team.roles.indexOf('Commander') > -1) {
                    commanderEmail = team.profile.email
                }
            })
        }
        return commanderEmail
    } catch (ex) {
        logger.error(`Error getting commander email from Blameless: ${ex.message}`, { error: ex.message, dataDump: ex })
        return ''
    }
}