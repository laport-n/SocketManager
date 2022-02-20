import React, { useEffect, useState } from 'react';
import './Input.css';
import { Socket } from 'socket.io-client';

function Input(props: { socket: Socket, pushEntryInHistorique: ({ type, value}: {type: string, value: string}) => void}) {
    
    const [input, setInput] = useState<string>('');
    const [socket, setSocket] = useState(props.socket);

    const updateInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(event.target.value);
    }
    const emitMessage = (): void => {
        socket.emit('chat message', input);
        setInput('');
        props.pushEntryInHistorique({
            type: 'Out',
            value: input
        });
    }

    useEffect(() => {
        setSocket(props.socket);
    }, [props.socket]);

    return (
        <div className="ml-auto mr-auto w-[99%] z-10 h-[7%] mt-[1%] bg-white rounded-t-lg shadow-lg flex items-center space-x-4">
            <input value={input} onInput={updateInput} type="text" className="rounded-tl-lg w-[95%] h-[98%] p-4" id="input" autoComplete="off" />
            <button className="box-content border-2 border-black m-0 w-[5%] h-[98%] bg-keppel rounded-tr-lg" onClick={emitMessage}>SEND</button>
        </div>
    );
}

export default Input;
