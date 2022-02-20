import './ListMessage.css';
import Out from '../Messages/Out/Out';
import In from '../Messages/In/In';

function ListMessage(props: { historique: {type: string, value: string}[] }) {
    const listItems = props.historique.map((message: any) => {
            switch (message.type) {
                case 'Out':
                    return <Out message={message.value}/>
                case 'In':
                    return <In message={message.value}/>
                case 'Broadcast':
                    // Todo component broadcast
                    return;
                default:

                break;
            }
        }
    );

    return (
        <div className="flex flex-col flex-1 place-content-end w-full h-full">
            {listItems}
        </div>
    );
}

export default ListMessage;
