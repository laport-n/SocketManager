import { useState } from 'react';
import Button from '../../components/Button/Button';
import FormInput from '../../components/Input/FormInput/FormInput';
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {

    const [userName, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const navigate = useNavigate();

    const updateUserName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value);
    }

    const onClick = (): void => {
        if (userName) {
            localStorage.setItem('username', userName);
            navigate('/panel');
        }
    }

    return (
        <div className='m-0 p-0 flex w-full h-[100vh]'>
            <div className="ml-auto mr-auto mt-auto mb-auto w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <FormInput value={userName} onInput={updateUserName} labelText={"Username"} placeHolder={"Enter your username"} />
                    <div className="flex items-center justify-between">
                        <Button text={"Let's chat"} onClick={onClick} />
                    </div>
                </form>
                <p className="text-center text-black text-xs">
                    &copy;2022 Laporte Nicolas - training frontend skills.
                </p>
            </div>
        </div>
    );
}

export default Login;
