import axios from 'axios'
import { logger } from 'util/logger'
import { blamelessConfig } from 'config/env'
import { findIndex } from 'lodash'

export const getIncident = async (incidentId: number | string): Promise <object> => {
    return await axios.get(`https://${blamelessConfig.hostName}/api/v1/incidents/${incidentId}`, await defaultOptions()).then((result) => {
        return result.data.incident
    }).catch((ex) => {
        logger.error(`Error Fetching Blameless Incident ${incidentId}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return {}
    })    
}

export const getIncidentTasks = async (incidentId: number | string): Promise <object[]> => {
    return await axios.get(`https://${blamelessConfig.hostName}/api/v1/incidents/${incidentId}/tasks`, await defaultOptions()).then((result) => {
        return result.data.tasks.sort((a: any, b: any) => (a.order_number < b.order_number) ? -1 : 1);
    }).catch((ex) => {
        logger.error(`Error Fetching Blameless Incident ${incidentId} Tasks: ${ex.message}`, { error: ex.message, dataDump: ex })
        return []
    })
}

export const getIncidentFollowUpAction = async (incidentId: number | string, actionSummary: string): Promise <object> => {
    return await axios.get(`https://${blamelessConfig.hostName}/api/v1/incidents/${incidentId}/actions`, await defaultOptions()).then((result) => {
        const idx = findIndex(result.data.actions, (e: any) => {
            return e.summary === actionSummary
        })
        return idx > -1 ? result.data.actions[idx] : {}
    }).catch((ex) => {
        logger.error(`Error Fetching Blameless Incident ${incidentId} Follow Up Actions: ${ex.message}`, { error: ex.message, dataDump: ex })
        return {}
    })
}

export const updateIssue = async (incidentId: number | string, updateObject: object): Promise <void> => {
    await axios.put(`https://${blamelessConfig.hostName}/api/v1/incidents/${incidentId}`, updateObject, await defaultOptions()).then(() => {
        return true
    }).catch((ex) => {
        logger.error(`Error updating Blameless Incident ${incidentId}: ${ex.message}`, { error: ex.message, dataDump: ex })
    })
}

export const addLinearIssueToBlameless = async (linearIssue: any, incidentId: number | string): Promise <void> => {
    const data: object = {
        ticket: {
            type: "CUSTOM", 
            key: linearIssue.identifier, 
            url: linearIssue.url, 
            raw: {}
        }
    }
    await axios.put(`https://${blamelessConfig.hostName}/api/v1/incidents/${incidentId}`, data, await defaultOptions()).then(() => {
        return true
    }).catch((ex) => {
        logger.error(`Error Adding Linear Issue ${linearIssue.id} to Blameless Incident ${incidentId} Tasks: ${ex.message}`, { error: ex.message, dataDump: ex })
    })
}

export const getUsers = async (): Promise <object[]> => {
    return await axios.get(`https://${blamelessConfig.hostName}/api/v1/identity/user`, await defaultOptions()).then((result) => {
        return result.data.response.users
    }).catch((ex) => {
        logger.error(`Error Fetching Blameless Users: ${ex.message}`, { error: ex.message, dataDump: ex })
        return []
    })
}

const defaultOptions = async (): Promise <object> => {
    const accessToken = await getAccessToken()
    return {
        headers: {
            'contnent-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }
}

const getAccessToken = async (): Promise <object> => {
    const data: object = {
        client_id: blamelessConfig.clientId,
        client_secret: blamelessConfig.clientSecret,
        audience: blamelessConfig.hostName,
        grant_type: 'client_credentials'
    }
    const options = {
        headers: {'contnent-type': 'application/json'}
    }
    return await axios.post('https://blamelesshq.auth0.com/oauth/token', data, options).then((result) => {
        return result.data.access_token
    }).catch((ex) => {
        logger.error(`Error retrieving Access Token for Blameless: ${ex.message}`, { error: ex.message, dataDump: ex })
        return {}
    })
}