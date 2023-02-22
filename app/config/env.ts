
import * as dotenv from 'dotenv'
dotenv.config()

// Server Config
export const host = process.env.HOST
export const port = parseInt(process.env.PORT, 10) || 8000
export const corsOrigin = '*'

// Logs
export const logLevel = process.env.LOG_LEVEL || 'info'

// Application Keys
export const linearConfig = {
    apiKey: process.env.LINEAR_API_KEY,
    defaultTeamId: process.env.LINEAR_DEFAULT_TEAM_ID,
    defaultProjectId: process.env.LINEAR_DEFAULT_PROJECT_ID,    
}

export const blamelessConfig = {
    clientId: process.env.BLAMELESS_CLIENT_ID,
    clientSecret: process.env.BLAMELESS_CLIENT_SECRET,
    hostName: process.env.BLAMELESS_HOST_NAME
}