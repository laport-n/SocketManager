import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { SocketOrchestrator } from './orchestrators/socketOrchestrator';
import { RoomOrchestrator } from "./orchestrators/roomOrchestrator";
import { UserController } from "./controllers/userController";

const app: Application = express();
const port = 3001;

// Body parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/",
    async (_req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Hello socket manager!",
        });
    }
);

// ROOM FEATURE SERVER SIDE
// Example on how implement ROOM feature for a server
app.post('/room',
    async (req: Request, res: Response): Promise<Response> => {
        const { userId, name, isPublic, context, invitedUsers } = req.body;
        console.log(req.body);
        const roomOrchestrator = RoomOrchestrator.getInstance();
        const room = await roomOrchestrator.createNewRoom(userId, name, context, isPublic, invitedUsers);
        console.log(room);
        return res.status(200).send(room);
    }
);

app.get('/room',
    async (req: Request, res: Response): Promise<Response> => {
        const roomOrchestrator = RoomOrchestrator.getInstance();
        const rooms = roomOrchestrator.getRooms();
        return res.status(200).send(rooms);
    }
);

app.get('/room/:roomId',
    async (req: Request, res: Response): Promise<Response> => {
        const { roomId } = req.query;
        const roomOrchestrator = RoomOrchestrator.getInstance();
        const room = roomOrchestrator.getRoomById(roomId as string);
        return res.status(200).send(room);
    }
);
// ROOM FEATURE SERVER SIDE


// USER FEATURE SERVER SIDE
app.get('/users',
    async (_req: Request, res: Response): Promise<Response> => {
        const usersController = new UserController();
        const users = await usersController.findAllWithoutSessions();
        return res.status(200).send(users);
    }
);
// USER FEATURE SERVER SIDE


try {
    const server = app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });

    const socketOrchestrator = new SocketOrchestrator(server);
    const listOfListenerMethods = (socket: any) => {

        socket.on('joinRoom', (roomId: string) => {
            console.log(roomId);
            RoomOrchestrator.getInstance().userJoin(roomId, socket.data.userId);
            socket.join(roomId);
        });

        socket.on('sendMessageRoom', (roomId:string, message: string) => {
            socket.to(roomId).emit(message);
        });

        socket.on('sendMessage', (message: any) => {
            socketOrchestrator.io.emit('broadcast', {message});
        });
    }
    socketOrchestrator.listenersInitialization(listOfListenerMethods);

} catch (error: any) {
    console.error(`Error ${error}`);
}