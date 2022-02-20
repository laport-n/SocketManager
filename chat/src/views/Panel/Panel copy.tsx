import './Panel.css';
import InputChat from '../../components/Input/InputChat/InputChat';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import ListMessage from '../../components/ListMessage/ListMessage';

function Panel() {
    const [socket, setSocket] = useState<any>(null);
    const [historique, setHistorique] = useState<{ type: string, value: string }[]>([]);

    const pushEntryInHistorique = ({ type, value }: { type: string, value: string }): void => {
        setHistorique((oldArray) => [...oldArray, { type, value }]);
    }

    useEffect(() => {
        const URL = "http://localhost:3001";
        const username = localStorage.getItem('username');
        const sessionId = localStorage.getItem('sessionId');
        const userId = localStorage.getItem('userId');
        const socket = io(URL, {
            autoConnect: false, transports: ['websocket'],
            query: {
                username,
                sessionId,
                userId
            }
        });
        socket.connect();
        socket.on('authenticated', (data) => {
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('userId', data.userId);
        });
        socket.on('broadcast', (data) => {
            pushEntryInHistorique({ type: 'In', value: data.message });
        });
        setSocket(socket);
    }, []);

    return (
        <div className="flex flex-col flex-1 w-full h-full">
                        <div className="z-0 p-6 mr-auto ml-auto w-[96%] h-[96%] content-end flex  mt-1/6 bg-black rounded-tl-lg rounded-b-lg shadow-lg shadow-indigo-500/50 flex items-center space-x-4">
                <ListMessage historique={historique} />
            </div>

            <InputChat socket={socket} pushEntryInHistorique={pushEntryInHistorique} />
        </div>
    );
}

export default Panel;
