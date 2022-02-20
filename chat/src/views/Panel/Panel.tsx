import './Panel.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { BiCircle } from "react-icons/bi";
import InputChat from '../../components/Input/InputChat/InputChat';

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
        const usersTmp = [];
        let isPushed = false;
        for (var x = 0; x < json.length; x++) {
            const context = JSON.parse(json[x].context);
            json[x].context = context;
            if (json[x]._id == userId) {
                context.username = context.username + ' - yourself';
                json[x].context = context;
                usersTmp.unshift(json[x]);
                isPushed = true;
            }
            json[x].color = json[x].isOnline === true ? "#42cd42" : "red";
            json[x].status = json[x].isOnline === true ? "online" : "offline";
            if (!isPushed) {
                usersTmp.push(json[x]);
            }
            isPushed = false;
        }
        setUsers(usersTmp);
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
                <div className='transition duration-300 delay-150 bg-[#7200cb47] flex flex-row min-h-[90px] w-full'>
                        <div className='pl-8 flex flex-col w-full'>
                            <div className='text-underline text-white mt-aut mb-auto w-auto mt-auto mb-auto'>
                                Users
                            </div>
                        </div>
                </div>
                { users &&
                    users.map((user: any) => (
                        <div key={user.context.username} className='transition duration-300 delay-150 hover:bg-[#7200cb47] hover:cursor-pointer flex flex-row min-h-[90px] w-full'>
                            <div className='pl-8 flex flex-col w-full'>
                                <div className='text-white mt-4 mb-0 w-auto mt-auto mb-auto'>
                                    {user.context.username}
                                </div>
                                <div className='h-[20px] flex flex-row mt-1 w-auto mt-auto mb-auto text-sm'>
                                    <BiCircle className='m-0 mr-2' size='20px' color={user.color} />
                                    <p className='text-gray-400'>{user.status}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
                    <div className='transition duration-300 delay-150 bg-[#7200cb47] flex flex-row min-h-[90px] w-full'>
                            <div className='pl-8 flex flex-col w-full'>
                                <div className='text-underline text-white mt-aut mb-auto w-auto mt-auto mb-auto'>
                                    Rooms
                                </div>
                            </div>
                    </div>
                        <div className='transition duration-300 delay-150 hover:bg-[#7200cb47] hover:cursor-pointer flex flex-row min-h-[90px] w-full'>
                            <div className='pl-8 flex flex-col w-full'>
                                <div className='text-white mt-4 mb-0 w-auto mt-auto mb-auto'>
                                    ReactJS c'est LOURD
                                </div>
                                <div className='h-[20px] flex flex-row mt-1 w-auto mt-auto mb-auto text-sm'>
                                    <BiCircle className='m-0 mr-2' color={'yellow'} size='20px' />
                                    <p className='text-gray-400'>open to talk</p>
                                </div>
                            </div>
                        </div>
                </div>
            <div className='flex-1 flex flex-col'>
                <div className='flex justify-center content-center items-center w-[95%] z-10 space-y-2.5 mr-auto ml-auto mt-5 flex-1 flex-col drop-shadow-lg bg-platinium z-40 '>
                    <h1 className='min-h-[50px] text-5xl font-medium text-slate-900 dark:text-slate-200'>Click on someone username to start chat</h1>
                </div>
                <div className='flex flex-row min-h-[90px] relative bg-black w-[90%] ml-auto mr-auto -top-[4%] z-40 rounded-md' >
                    <input className="relative -top-[10px] -left-[10px] min-h-[90px] w-[85%] rounded-md placeholder:italic placeholder:text-slate-400 block bg-white w-full py-2 pl-9 pr-3 focus:outline-none focus:border-keppel-500 focus:ring-keppel-500 focus:ring-1 sm:text-sm" placeholder="Write something..." type="text" name="search"/>
                    <button className="font-medium text-slate-900 dark:text-slate-200 relative -top-[10px] -left-[5px] min-h-[90px] w-[14%] rounded-md block bg-keppel w-full sm:text-xl" type="button">
                         SEND
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Panel;
