import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { SocketOrchestrator } from './orchestrators/socketOrchestrator';

const app: Application = express();
const port = 3001;

// Body parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Hello socket manager!",
        });
    }
);

try {
    const server = app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });

    const socketOrchestrator = new SocketOrchestrator(server);
    const listOfListenerMethods = (socket: any) => {
        socket.on('message', (message: any) => {
            console.log(message);
            console.log("SOCKET-DATA", socket.data);
        });
    }
    socketOrchestrator.listenersInitialization(listOfListenerMethods);

} catch (error: any) {
    console.error(`Error ${error}`);
}