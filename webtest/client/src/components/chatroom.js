import { useParams } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { useChat } from '../hooks/useChat'
import { MessageForm } from './chat/messageForm'
import { MessageList } from './chat/messageList'
import { UserList } from './chat/users'
import { Container } from 'react-bootstrap'

export function FirstRoom(){
    const {roomId} = useParams();
    const [username] = useLocalStorage('username');
    const {users, messages, sendMessage, removeMessage} = useChat(roomId);

    return (
        <Container>
            <h2 className={'text-center'}>ChatRoom</h2>
            <UserList users={users}/>
            <MessageList messages={messages} removeMessage={removeMessage}/>
            <MessageForm username={username} sendMessage={sendMessage}/>
        </Container>
    );
}
