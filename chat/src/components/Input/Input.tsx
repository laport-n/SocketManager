import './Input.css';

function Input(props: { input: string, updateInput: (event:  React.ChangeEvent<HTMLInputElement>) => void, onClick: any}) {
    const { input, updateInput, onClick } = props;
    return (
        <div className="ml-auto mr-auto w-[99%] z-10 h-[7%] mt-[1%] bg-white rounded-t-lg shadow-lg flex items-center space-x-4">
            <input value={input} onInput={updateInput} type="text" className="rounded-tl-lg w-[95%] h-[98%] p-4" id="input" autoComplete="off" />
            <button className="box-content border-2 border-black m-0 w-[5%] h-[98%] bg-keppel rounded-tr-lg" onClick={onClick}>SEND</button>
        </div>
    );
}

export default Input;
