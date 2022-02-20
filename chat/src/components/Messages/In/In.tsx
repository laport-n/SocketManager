import './In.css';

function In(props: { message: string }) {
    return (
        <p className="mr-auto m-4 shadow-lg shadow-indigo-500/50 bg-keppel text-black w-fit p-4 rounded-lg" key={props.message}>{props.message}</p>
    );
}

export default In;
