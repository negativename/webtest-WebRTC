import { useState, useRef } from 'react'
import { useLocalStorage } from 'react-use'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function StartPage(){
    const [username, setUsername] = useLocalStorage('username', 'Client2');
    const [roomId, setRoomId] = useState('chatroom');
    const linkRef = useRef(null)

    const handleChangeName = (e) => {
        setUsername(e.target.value);
    }

    const handleChangeRoom = (e) => {
        setRoomId(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        linkRef.current.click();
    }

    const trimmed = username.trim();

    return(
      <Form className={'mt-5'} style={{maxWidth: '320px', margin: '0 auto'}} onSubmit={handleSubmit}>
          <Form.Group>
              <Form.Label>Enter your nickname</Form.Label>
              <Form.Control value={username} onChange={handleChangeName} />
          </Form.Group>
          <Form.Group>
              <Form.Label>Choose room:</Form.Label>
              <Form.Control as='select' value={roomId} onChange={handleChangeRoom}>
                  <option value='chatroom'>ChatRoom</option>
                  <option value='videochat'>VideoChat</option>
              </Form.Control>
          </Form.Group>
          {trimmed && (
             <Button variant='success' as={Link} to={`/${roomId === "videochat" ? roomId : `chatroom/${roomId}`}`} ref={linkRef}>Enter</Button>
          )}
      </Form>
    );
}
