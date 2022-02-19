import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { SocketWrapper } from './modules/socketWrapper/socketWrapper';

const app: Application = express();
const port = 3000;

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

    const socketWrapper = new SocketWrapper(server);
    const listOfListenerMethods = (socket: any) => {
        socket.on('message', (message: any) => {
            console.log(message);
            console.log("SOCKET-DATA", socket.data);
        });
    }
    socketWrapper.listenersInitialization(listOfListenerMethods);

} catch (error: any) {
    console.error(`Error ${error}`);
}