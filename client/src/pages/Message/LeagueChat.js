import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Message.css";
import { useUserAuth } from '../../context/UserAuthProvider';

const LeagueChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const { user } = useUserAuth();

  const socket = io('http://localhost:5555');

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('receive_message', (data) => {
      handleReceivedMessage(data);
    });

    // Listen for user list updates
    // socket.on('user_list', (users) => {
    //   console.log('Received user list:', users);
    //   setUserList(users);
    // });
console.log(userList)
    // Welcome message
    socket.on('welcome_message', (message) => {
      setWelcomeMessage(message);
    });

    // Check if the socket connection is opened
    socket.on('connect', () => {
      console.log('Socket connection opened.');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Display a welcome message when the user joins
    if (welcomeMessage) {
      setMessages((prevMessages) => [...prevMessages, { username: 'System', message: welcomeMessage }]);
    }
  }, [welcomeMessage]);

  const handleReceivedMessage = (data) => {
    // Update the messages state with the received message
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  const sendMessage = () => {
    // Send the message to the server
    socket.emit('send_message', { message, username: user.username });

    // Clear the input field
    setMessage('');
  };

  const isCurrentUser = (msgUsername) => {
    return msgUsername === user.username;
  };

 
  return (
    <>
    <div className="message-container">      
      {/* <div className="user-list">
        <h3>Users</h3>
        <ul style={{display: 'flex'}}>
          {userList.map((username) => (
            <li key={username}>              
              {username} <span className={getUserStatus(username)}></span>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="message-display">
        <ul>
          {messages.map((msg, index) => (
            <li
              key={index}
              className={isCurrentUser(msg.username) ? 'current-user' : 'other-user'}
            >
              <div className="message-bubble">
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
    <div className="message-input" style={{width: '80%', margin: "0 auto", background: ' #142e60'}}>
    <input
      type="text"
      placeholder="Your message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    <button onClick={sendMessage} >Send</button>
  </div>
  </>
  );
};

export default LeagueChat;
