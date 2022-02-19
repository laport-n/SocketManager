export type TSession = {
    sessionId: string,
    userId: string,
    context: {
        [key: string]: any
    }
};