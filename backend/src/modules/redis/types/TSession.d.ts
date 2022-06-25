export type TSession = {
  sessionId: string;
  userId: string;
  socketId: string;
  context: {
    [key: string]: any;
  };
};
