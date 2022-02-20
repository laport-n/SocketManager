import React, { useEffect, useState } from 'react';
import './InputChat.css';
import { Socket } from 'socket.io-client';
import Input from '../Input';

function InputChat(props: { socket: Socket, pushEntryInHistorique: ({ type, value}: {type: string, value: string}) => void}) {
    
    const [input, setInput] = useState<string>('');
    const [socket, setSocket] = useState(props.socket);

    const updateInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(event.target.value);
    }
    const emitMessage = (): void => {
        socket.emit('sendMessage', input);
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
        <Input input={input} updateInput={updateInput} onClick={emitMessage} />
    );
}

export default InputChat;
