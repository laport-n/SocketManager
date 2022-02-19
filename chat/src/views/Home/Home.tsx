import './Home.css';
import Input from '../../components/Input/Input'
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import ListMessage from '../../components/ListMessage/ListMessage';

function Home() {
    const [socket, setSocket] = useState<any>(null)
    const [historique, setHistorique] = useState<string[]>([]);

    const pushEntryInHistorique = (value: string): void => {
        setHistorique([...historique, value]);
    }

    useEffect(() => {
        const URL = "http://localhost:3001";
        const socket = io(URL, { autoConnect: false, transports: ['websocket'] });
        socket.connect();
        socket.on('authenticated', (data) => {
            console.log("data", data);
        });
        setSocket(socket);
    }, []);

    return (
        <div className="flex flex-col flex-1 w-full h-full">
            
            <div className="z-0 p-6 mr-auto ml-auto w-[96%] h-[96%] mt-1/6 bg-black rounded-tl-lg rounded-b-lg shadow-lg shadow-indigo-500/50 flex items-center space-x-4">
                <ListMessage historique={historique}/>
            </div>

            <Input socket={socket} pushEntryInHistorique={pushEntryInHistorique} />
        </div>
    );
}

export default Home;
