export type TSession = {
    sessionID: string,
    userID: string,
    context: {
        [key: string]: any
    }
};