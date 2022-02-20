import './Panel.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { BiCircle } from "react-icons/bi";

function Panel() {

    const [users, setUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [historique, setHistorique] = useState<{ type: string, value: string }[]>([]);

    const username = localStorage.getItem('username');
    const sessionId = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    const socketId = localStorage.getItem('socketId');

    const pushEntryInHistorique = ({ type, value }: { type: string, value: string }): void => {
        setHistorique((oldArray) => [...oldArray, { type, value }]);
    };

    const updateUserList = async () => {
        const res = await fetch("http://localhost:3001/users");
        const json = await res.json();
        for (var x = 0; x < json.length; x++) {
            const context = JSON.parse(json[x].context);
            json[x].context = context;
            if (context.username == username) {
                context.username = context.username + ' - yourself';
                json[x].context = context;
            }
            json[x].color = json[x].isOnline === true ? "#42cd42" : "red";
        }
        console.log(json);
        setUsers(json);
    };

    useEffect(() => {
        const URL = "http://localhost:3001";
        const context = { username };
        const socket = io(URL, {
            autoConnect: false, transports: ['websocket'],
            query: {
                context: JSON.stringify(context),
                sessionId,
                userId,
                socketId
            }
        });
        socket.connect();
        socket.on('authenticated', (data) => {
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('socketId', data.socketId);
        });
        socket.on('broadcast', (data) => {
            pushEntryInHistorique({ type: 'In', value: data.message });
        });
        setSocket(socket);

        socket.on('new_user', (data) => {
            updateUserList();
        });

        socket.on('user_connect', (data) => {
            updateUserList();
        });

        socket.on('user_disconnect', (data) => {
            updateUserList();
        });

        updateUserList();

    }, []);

    return (
        <div className="flex flex-row flex-1 w-full h-full">
            <div className='flex flex-col drop-shadow-lg basis-1/4 sm:basis-0/4 bg-[#2E0052] z-40 '>
                {users &&
                    users.map((user: any) => (
                        <div key={user.context.username} className='transition duration-300 delay-150 hover:bg-[#7200cb47] hover:cursor-pointer flex flex-row min-h-[90px] w-full'>
                            <div className='pl-8 flex flex-col w-full'>
                                <div className='text-white mt-4 mb-0 w-auto mt-auto mb-auto'>
                                    {user.context.username}
                                </div>
                                <div className='h-[20px] flex flex-row mt-1 w-auto mt-auto mb-auto text-sm'>
                                    <BiCircle className='m-0 mr-2' size='20px' color={user.color} />
                                    <p className='text-gray-400'>online</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Panel;
