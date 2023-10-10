import React from "react";
// import noDP from "../../public/noDP.jpg";
import noDP from "../../public/User-image.png";
import { useState } from "react";
import ChatInput from "./ChatInput";
import "../assets/CSS/chatcontainer.css";
import { postdata } from "../Utils/http.class";
import { useEffect, useRef } from "react";

function AiChatContainer({ currentUser }) {
  const [message, setMessage] = useState([]);
  const [typing, setTyping] = useState(true);
  const [demo, setDemo] = useState(false);
  const scroll = useRef(null);

  const handleSendChat = async (msg) => {
    if (msg) {
      setDemo(true);
      setTyping(true);
    }
    const data = {
      message: msg,
    };
    const infoo = [...message];
    infoo.push({ fromSelf: true, message: msg });
    setMessage([...infoo]);
    const response = await postdata("message/chatapi", data);
    const res = await response.json();
    if (res) {
      setTyping(false);
    }
    setMessage((pre) => [...pre, { fromSelf: false, message: res.message }]);
    // setResponse([...response, { fromSelf: false, message: res.message }]);
  };

  useEffect(() => {
    const div = scroll.current;
    if (div) {
      div.scroll({ top: div.scrollHeight, left: 0, behavior: "smooth" });
    }
  }, [message]);

  return (
    <>
      <div className="chat-container">
        <div className="user-container">
          <img className="profile-img" src={noDP} alt=" "></img>
          AI
        </div>
        <div id="scrollTop" className="messages-container" ref={scroll}>
          {message?.map((data, index) => {
            return (
              <div
                key={index}
                className={
                  data.fromSelf ? "messages-send" : "messages-rececive"
                }
              >
                <pre className={data.fromSelf ? "sender-msg" : "receiver-msg"}>
                  {data.message}
                  <br></br>
                </pre>
              </div>
            );
          })}

          <div ref={scroll}></div>
        </div>
        <div className="type">{typing && demo ? <p>Typing...</p> : null}</div>

        <div className="chat-input">
          <ChatInput handleSendChat={handleSendChat} />
        </div>
      </div>
    </>
  );
}

export default AiChatContainer;
