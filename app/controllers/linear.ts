import { linearConfig } from 'config/env'
import { NewLinearIssuePayload } from 'config/payload-types'
import { isEmpty } from 'lodash'
import { linearClient } from 'util/linear-client'
import { logger } from 'util/logger'

export const createIssue = async (linearIssueTemplate: NewLinearIssuePayload): Promise <object> => {
    return await linearClient.createIssue(linearIssueTemplate.issue).then((creationData) => creationData.issue.then((issue) => {
        return issue
    })).catch((ex) => {
        logger.error(`Error creating Linear Issue: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })
}

export const updateIssue = async (issueId: string, updateObject: object): Promise <void> => {
    return await linearClient.updateIssue(issueId, updateObject).then(() => {
        return null
    }).catch((ex) => {
        logger.error(`Error updating Linear Issue ${issueId}: ${ex.message}`, { error: ex.message, dataDump: ex })
    })
}

export const getIssue = async (issueId: string): Promise <object> => {
    return await linearClient.issue(issueId).then((creationData) => {
        return creationData
    }).catch((ex) => {
        logger.error(`Error fetching Linear Issue ${issueId}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })
}

export const getIssueByBlamelessId = async (blamelessId: string | number): Promise <object> => {
    return await linearClient.issues({filter: {and: [{description: {contains: `Blameless Incident ID: ${blamelessId}`}}, {parent: {id: null}}, {labels: {name: {eqIgnoreCase: 'Blameless Incident'}}}]}}).then((linearIssues) => {
        return linearIssues.nodes[0] || null
    }).catch((ex) => {
        logger.error(`Error fetching Linear Issue from Blameless ID ${blamelessId}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null    
    })
}

export const getLabelId = async (labelName: string): Promise <string> => {
    const labelId = await linearClient.issueLabels({filter: {and: [{team: {id: {eq: linearConfig.defaultTeamId}}}, {name: {eqIgnoreCase: labelName}}]}}).then((searchResponse) => {
        return searchResponse.nodes.length > 0 ? searchResponse.nodes[0].id : null
    }).catch((ex) => {
        logger.error(`Error fetching default Linear Label ${labelName}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })

    if (isEmpty(labelId)) {
        return await linearClient.createIssueLabel({teamId: linearConfig.defaultTeamId, name: labelName}).then((createResponse) => createResponse.issueLabel.then((createdLabel) => {
            return createdLabel.id
        })).catch((ex) => {
            logger.error(`Error creating Linear Label ${labelName}: ${ex.message}`, { error: ex.message, dataDump: ex })
            return null
        })
    } else {
        return labelId
    }
}

export const getUser = async (userId: string): Promise <string> => {
    return await linearClient.user(userId).then((user) => {
        return user
    }).catch((ex) => {
        logger.error(`Error fetching default Linear User ${userId}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })
}

export const getUserIdByEmail = async (email: string): Promise <string> => {
    return await linearClient.users({filter: {email: {eq: email}}}).then((searchResponse) => {
        return searchResponse.nodes.length > 0 ? searchResponse.nodes[0].id : null
    }).catch((ex) => {
        logger.error(`Error fetching default Linear User ${email}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })
}

export const getWorkflowState = async (stateId: string): Promise <object> => {
    return await linearClient.workflowState(stateId).then((workflow) => {
        return workflow
    }).catch((ex) => {
        logger.error(`Error getting Linear Workflow State: ${stateId}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })
}

export const getWorkflowStateByName = async (name: string): Promise <object> => {
    return await linearClient.workflowStates({filter: {and: [{name: {eqIgnoreCase: name}}, {team: {id: {eq: linearConfig.defaultTeamId}}}]}}).then((workflowStates) => {
        return workflowStates.nodes[0] || null
    }).catch((ex) => {
        logger.error(`Error getting Linear Workflow State ${name}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    })
}

export const updateIssueWorkflowState = async (issueId: string, workflowStateId: string): Promise <void> => {
    await linearClient.updateIssue(issueId, {stateId: workflowStateId}).then(() => {
        return
    }).catch((ex) => {
        logger.error(`Error updating Lienar Issue ${issueId} to Workflow State ${workflowStateId}: ${ex.message}`, { error: ex.message, dataDump: ex })
    })
}

export const getBlamelessIdFromDescription = (linearDescription: any): number => {
    try {
        const searchString = 'Blameless Incident ID:'
        const startIndex = linearDescription.indexOf(searchString) + searchString.length
        const endIndex = linearDescription.indexOf('\n')
        return Number(linearDescription.slice(startIndex, endIndex).trim())
    } catch (ex) {
        logger.error(`Error Getting Blameless ID from Linear Description: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    }
}