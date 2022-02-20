import './Out.css';

function Out(props: { message: string }) {
    return (
        <p className="ml-auto m-4 shadow-lg shadow-indigo-500/50 bg-white text-black w-fit p-4 rounded-lg" key={props.message}>{props.message}</p>
    );
}

export default Out;
