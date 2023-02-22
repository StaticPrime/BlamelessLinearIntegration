import { findLastKey, isNumber } from "lodash"
import { logger } from "util/logger"

interface priorityInterface {
    urgent: { blameless: string, linear: number },
    high: { blameless: string, linear: number },
    medium: { blameless: string, linear: number },
    low: { blameless: string, linear: number }
}

const priorities: priorityInterface = {
    urgent: { blameless: 'SEV0', linear: 4 },
    high: { blameless: 'SEV1', linear: 3 },
    medium: { blameless: 'SEV2', linear: 2 },
    low: { blameless: 'SEV3', linear: 1 }
}

export const getPriority = (priorityLevel: number | string): string => {
    try {
        return isNumber(priorityLevel) ? priorities[findLastKey(priorities, { linear: priorityLevel })].blameless : priorities[findLastKey(priorities, { blameless: priorityLevel })].linear.toString()
    } catch (ex) {
        logger.error(`Error fetching Priority ${priorityLevel}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return null
    }
}