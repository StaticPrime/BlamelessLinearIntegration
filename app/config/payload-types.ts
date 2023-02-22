import { OK } from 'util/return-codes'

export interface APIReturnPayload {
  code: number,
  message?: string,
  data?: object,
}

export interface IncidentPayload {
  id: string,
  title: string,
  description?: string,
  severity: number,
  url: string,
  videoConferenceUrl?: string,
  retrospectiveUrl?: string,
  slackUrl?: string,
  slackChannel?: string,
  commanderEmail: string
}

export interface NewLinearIssuePayload {
  issue: {
      title: string,
      assigneeId?: string,
      description?: string,
      teamId: string,
      priority: number,
      projectId: string,
      labelIds: string[]
  },
  incident: {
      id: string,
      url: string,
      slackChannel: string,
      slackURL: string,
      videoConferenceURL: string,
      retrospectiveURL: string
  }
}

export function InitializePayload (config: APIReturnPayload): { code: number; message?: string; data?: object; } {
return { code: config.code || OK }
}