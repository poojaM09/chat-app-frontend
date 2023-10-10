import React from "react";
// import noDP from "../../public/noDP.jpg";
import noDP from "../../public/User-image.png";
import { useState } from "react";
import ChatInput from "./ChatInput";
import "../assets/CSS/chatcontainer.css";
import { postdata } from "../Utils/http.class";
import { useEffect, useRef } from "react";
import ImageModel from "../Components/ImageModel";

function AiImageContainer() {
  const [message, setMessage] = useState([]);
  const [typing, setTyping] = useState(true);
  const [demo, setDemo] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [Img, setImg] = useState(null);
  const [chatGptImg, setChatGptImg] = useState(false);
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
    const response = await postdata("message/imagGenrator", data);
    const res = await response.json();
    if (res) {
      setTyping(false);
      setChatGptImg(true);
    }
    setMessage((pre) => [
      ...pre,
      { fromSelf: false, message: res.message, msg_type: "image" },
    ]);
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
          AI Image Generate
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
                {data.message && data?.msg_type == "image" ? (
                  <img
                    src={data.message}
                    style={{
                      height: "200px",
                      width: "200px",
                      border: "2px solid #d9d9d9",
                    }}
                    onClick={() => {
                      setShowImg(true);
                      setImg(data.message);
                    }}
                  ></img>
                ) : (
                  <pre
                    className={data.fromSelf ? "sender-msg" : "receiver-msg"}
                  >
                    {data.message}
                    <br></br>
                  </pre>
                )}
              </div>
            );
          })}
          {showImg ? (
            <ImageModel
              Img={Img}
              setShowImg={setShowImg}
              chatGptImg={chatGptImg}
            />
          ) : null}
          <div ref={scroll}></div>
        </div>

        <div className="type">
          {typing && demo ? <p>Generating...</p> : null}
        </div>

        <div className="chat-input">
          <ChatInput handleSendChat={handleSendChat} />
        </div>
      </div>
    </>
  );
}

export default AiImageContainer;
