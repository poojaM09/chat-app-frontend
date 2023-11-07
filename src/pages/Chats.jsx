import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Contact from "./Contact";
import Welcome from "./Welcome";
import ChatContainer from "./ChatContainer";
import AiImageContainer from "./AiImageContainer";
import ClientChatConatainer from "./ClientChatConatainer";
import { socket } from "../socket";
import { getdata } from "../Utils/http.class";
import "../assets/CSS/chat.css";
import NavigationBar from "../Components/NavigationBar"

function Chats() {
  const [currentChat, setCurrentChat] = useState(undefined);
  const [contact, setContact] = useState([]);
  const [chatMsgData, setChatMsgData] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const { isLoggin, user } = useSelector((state) => state.auth);
  
  const getUsers = async () => {
    const res = await getdata("user/getUser");
    const response = await res.json();
    setContact(response.users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("add-user", user.id);
    }
  }, [user]);

  const [width, setWidth] = useState(window.innerWidth);
  const [showChat, setShowChat] = useState(false);
  const isMobile = width >= 768;
  const storedItem = localStorage.getItem('item');
  const getItem = JSON.parse(storedItem);

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
  };

  const handleShow = () => {
    setShowChat(true);
  };

  const handleHide = () => {
    setShowChat(false);
  };

  if (!isLoggin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="main-container">
      <NavigationBar />
      <div className="d-flex chat-wrapper">
        {(!showChat || isMobile) && (
          <div className="contact">
            <Contact
              handleCurrentChat={handleCurrentChat}
              contact={contact}
              currentUser={user}
              chatMsgData={chatMsgData}
              setOnlineUser={setOnlineUser}
              onlineUser={onlineUser}
              handleShow={handleShow}
            />
          </div>
        )}
        <div className={`chat ${showChat ? 'open' : ''}`}>
          {currentChat === undefined ? (
            <Welcome />
          ) : currentChat === "AI" ? (
            <AiImageContainer currentUser={user} />
          ) : user.contactNumber !== null ? (
            <ChatContainer
              currentChat={currentChat}
              currentUser={user}
              onlineUser={onlineUser}
              setChatMsgData={setChatMsgData}
              handlehide={handleHide}
            />
          ) : (
            <ClientChatConatainer
              currentChat={currentChat}
              currentUser={user}
              onlineIs={onlineIs}
              onlineUser={onlineUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
