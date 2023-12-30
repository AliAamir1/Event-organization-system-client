import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import "./Message.css";
import { Store } from "../Store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const MessageUI = (props) => {
  const { state } = useContext(Store);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    // console.log("I am testing the state");
    // console.log(state);
    const sender = state.userInfo._id;
    const receiver = props.vendorId;
    const fetchMessages = async () => {
      const response = await axios.get(`/api/messages/${sender}/${receiver}`);
      console.log(response.data);
      setMessages(response.data);
    };
    fetchMessages();
  }, [messages]);

  const pushMessage = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/api/messages/send", {
        message: messageInput,
        sender: state.userInfo._id,
        receiver: props.vendorId,
        time: 0,
        name: state.userInfo.name, // Set the sender's name
      });
      setMessages([...messages, data]);
      setMessageInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const close = () => {
    props.close();
  };

  return (
    <div className="msgContainer">
      <IconButton style={{ backgroundColor: "grey" }} onClick={close}>
        <CloseIcon style={{ color: "white" }} />
      </IconButton>

      <Container className="c1">
        <h1 className="heading1">Connect with vendors</h1>
        <Row className="r1">
          <Col sm={8} className="C2">
            <ListGroup className="lg2">
              {messages.map((message, index) => (
                <>
                  {message.sender &&
                  message.sender._id === state.userInfo._id ? (
                    <ListGroup.Item className="lgitem1" key={index}>
                      {console.log(message.sender, state.userInfo._id)}
                      {message.sender.name} : {message.message}
                    </ListGroup.Item>
                  ) : (
                    <ListGroup.Item className="lgitem1" key={index}>
                      {console.log(message.sender, state.userInfo._id)}
                      Vendor : {message.message}
                    </ListGroup.Item>
                  )}
                </>
              ))}
            </ListGroup>
            <div className="d2">
              <Form.Control
                className="fc"
                type="text"
                placeholder="Type your message here..."
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
              />
              <div className="input-group-append">
                <Button
                  className="b1"
                  variant="darkish"
                  type="submit"
                  onClick={pushMessage}
                >
                  Send
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MessageUI;
