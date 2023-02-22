import { LinearClient } from '@linear/sdk'
import { linearConfig } from 'config/env'

const linearClient = new LinearClient({
    apiKey: linearConfig.apiKey
})

export { linearClient }