import { logger } from "util/logger"

export const getPriority = (priorityType: string, priorityLevel: number | string) => {
    const returnType = priorityType === 'blameless' ? 'linear' : 'blameless'
    try {
        const idx = priorities.findIndex(pri => {
            return pri[priorityType] === priorityLevel
        })
        return idx > -1 ? priorities[idx][returnType] : priorities[0][returnType]
    } catch (ex) {
        logger.error(`Error fetching priority ${priorityType} at level ${priorityLevel}: ${ex.message}`, { error: ex.message, dataDump: ex })
        return priorities[0][returnType]
    }
}

const priorities: object[] = [
    { linear: 4, blameless: 'SEV0' },
    { linear: 3, blameless: 'SEV1' },
    { linear: 2, blameless: 'SEV2' },
    { linear: 1, blameless: 'SEV3' }
]