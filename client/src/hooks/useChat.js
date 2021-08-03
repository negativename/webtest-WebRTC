import { useLocalStorage } from 'react-use'
import { useBeforeUnload } from 'react-use'
import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import io from 'socket.io-client'

const server_url = 'http://localhost:5000';

export const useChat = (roomId) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);


    const [userId] = useLocalStorage('userId', nanoid(8));
    const [username] = useLocalStorage('username');

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(server_url, {
            query: {roomId}
        });

        socketRef.current.emit('user:add', {username, userId});
        socketRef.current.on('users', (users) => {
            setUsers(users);
        });

        socketRef.current.emit('message:get');
        socketRef.current.on('messages', (messages) => {
            const newMessages = messages.map((msg) =>
                msg.userId === userId ? {...msg, currentUser: true} : msg
            );
            setMessages(newMessages);
        });

        return () => {
            socketRef.current.disconnect();
        }
        // eslint-disable-next-line
    }, [roomId, userId, username])

    const sendMessage = ({messageText, senderName}) => {
        socketRef.current.emit('message:add', {
            userId,
            messageText,
            senderName
        });
    };

    const removeMessage = (id) => {
        socketRef.current.emit('message:remove', id);
    };

    useBeforeUnload(() => {
       socketRef.current.emit('user:leave', userId);
    });

    return {users, messages, sendMessage, removeMessage};
}

