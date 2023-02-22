import * as returnCodes from 'util/return-codes'

export interface ErrorType {
    code: number,
    message: string
}

export interface RouteErrorBody {
    code: string,
    message: string
}

export const UNKNOWN_ERROR: ErrorType = {
    message: 'Unexpected Error', code: returnCodes.ERROR
}

export const BAD_REQUEST = (reason?: string): ErrorType => {
    return { message: reason || 'Bad Request', code: returnCodes.BAD_REQUEST }
}

export const NOT_FOUND = (reason?: string): ErrorType => {
    return { message: reason || 'Resource Not Found', code: returnCodes.NOT_FOUND }
}

export const SERVER_ERROR: ErrorType = {
    message: 'An error occurred while we were processing your request', code: returnCodes.ERROR
}