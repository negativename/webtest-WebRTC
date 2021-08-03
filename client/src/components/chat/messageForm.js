import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FiSend } from 'react-icons/fi'

export const MessageForm = ({username, sendMessage}) => {
    const [text, setText] = useState('');

    const handleChangeText = (e) => {
        setText(e.target.value);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) {
            sendMessage({ messageText: text, senderName: username });
            setText('');
        }
    };

    return(
        <>
            <Form onSubmit={handleSendMessage}>
                <Form.Control value={text} onChange={handleChangeText} type='text' placeholder='Message...'/>
                <Button variant='success' type='submit'>
                    <FiSend />
                </Button>
            </Form>
        </>
    );
}