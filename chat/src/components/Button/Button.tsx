import './Button.css';

function Button(props: { text: string, onClick: () => void }) {

    const { text, onClick } = props;

    return (
        <button onClick={onClick} className="bg-black hover:bg-keppel text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            { text }
        </button>
    );
}

export default Button;
