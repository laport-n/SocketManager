import './ListMessage.css';

function ListMessage(props: { historique: String[] }) {
    const listItems = props.historique.map((message: any) =>
        <p className="text-white" key={message}>{message}</p>
    );

    return (
        <div className="flex flex-col flex-1 w-full h-full">
            {listItems}
        </div>
    );
}

export default ListMessage;
