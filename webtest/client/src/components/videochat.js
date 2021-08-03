import Peer from "simple-peer";
import io from "socket.io-client";
import React, {useEffect, useRef, useState} from "react";
import { useParams } from 'react-router-dom';
import {useLocalStorage} from "react-use";
import {Form, Button, Container, Card, Badge} from "react-bootstrap";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {BiPhoneCall} from "react-icons/bi"
import {MdAssignment} from "react-icons/md"

const server_url = "http://localhost:5000";

export function SecondRoom(){
    const {roomId} = useParams();
    const [ localUser, setLocalUser ] = useState("");
    const [ nameUser, setName ] = useLocalStorage("username");
    const [ stream, setStream ] = useState();
    const [ receivingCall, setReceivingCall ] = useState(false);
    const [ caller, setCaller ] = useState("");
    const [ callerSignal, setCallerSignal ] = useState();
    const [ callAccepted, setCallAccepted ] = useState(false);
    const [ idToCall, setIdToCall ] = useState("");
    const [ callEnded, setCallEnded] = useState(false);
    // const [ name, setName ] = useState("");
    const localVideo = useRef(null);
    const userVideo = useRef(null);
    const connectionRef= useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(server_url, {
            query: {roomId}
        });

        navigator.mediaDevices.getUserMedia({video:true, audio:true}).then((stream) => {
            setStream(stream);
            localVideo.current.srcObject = stream;
        });

        socketRef.current.on("localUser", (id) => {
           setLocalUser(id);
        });

        socketRef.current.on("callUser", (data) => {
           setReceivingCall(true);
           setCaller(data.from);
    //       setName(data.name);
           setCallerSignal(data.signal);
        });
    }, []);

    const callUser = (id) => {
        const peer = new Peer({
           initiator: true,
           trickle: false,
           stream: stream
        });
        peer.on("signal", (data) => {
            socketRef.current.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: localUser,
                name: nameUser
            });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });
        socketRef.current.on("callAccepted", (signal) => {
           setCallAccepted(true);
           peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
           initiator: false,
           trickle: false,
           stream: stream
        });
        peer.on("signal", (data) => {
            socketRef.current.emit("answerCall", {
               signal: data,
               to: caller
            });
        });
        peer.on("stream", (stream) => {
           userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return (
        <>
        <Container style={{ maxWidth: "450px" }}>
            {stream &&  <video playsInline muted ref={localVideo} autoPlay style={{ width: "350px" }} />}
        </Container>
        <Container style={{ maxWidth: "450px" }}>
                {callAccepted && !callEnded ?
                    <video playsInline ref={userVideo} autoPlay style={{ width: "350px" }} />:
                    null}
        </Container>
        <Container style={{ maxWidth: "450px" }}>
            <h2 style={{margin: "0 auto"}}>Hello {nameUser}!</h2>
            <CopyToClipboard text={localUser} style={{ marginBottom: "2rem" }}>
                <Button variant="primary" >
                    <MdAssignment />
                    Copy ID
                </Button>
            </CopyToClipboard>

            
            <Form className={'mt-5'} style={{ maxWidth: "450px" }}>
                <Form.Group>
                    <Form.Label>Enter id to call</Form.Label>
                        <Form.Control
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}/>
                </Form.Group>
            </Form>
            <Card style={{ maxWidth: "450px" }}>
                {callAccepted && !callEnded ? (
                    <Button variant="danger" onClick={leaveCall}>
                        End Call
                    </Button>
                ) : (
                    <Button variant="success" onClick={() => callUser(idToCall)}>
                        <BiPhoneCall />
                    </Button>
                )}
            </Card>
        </Container>
        <Container style={{ maxWidth: "450px", marginTop:"20px" }}>
            {receivingCall && !callAccepted ? (
                <Button style={{textAlign:"center"}} variant="success" onClick={answerCall}>
                    <p style={{textDecoration: "underline"}}>You have 1 incoming call. Click here to answer!</p>
                </Button>
            ) : null}
        </Container>
        </>
    )
}