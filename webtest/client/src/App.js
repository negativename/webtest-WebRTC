import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {StartPage} from './components/startpage'
import {FirstRoom} from "./components/chatroom";
import {SecondRoom} from "./components/videochat";
import {Container} from "react-bootstrap";

class NotFound extends Component {
    render() {
        return <h1>not found</h1>
    }
}

class App extends Component {
    render() {
        return (
            <Container style={{maxWidth: '512px'}}>
                <h1 className='mt-2 text-center'>Test task</h1>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={StartPage}/>
                        <Route path={"/chatroom/:roomId"} name={"chatroom"} component={FirstRoom}/>
                        <Route path={"/:roomId"} name={"videochat"} component={SecondRoom}/>
                        <Route component={NotFound}/>
                    </Switch>
                </BrowserRouter>
            </Container>
        )
    }
}

export default App;