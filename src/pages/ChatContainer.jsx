import React, { useEffect, useRef, useState } from "react";
import { postdata, postimage } from "../Utils/http.class";
import moment from "moment";
import { socket } from "../socket";
import noDP from "../../public/profile-user.png";
import Loader from "../Components/Loader";
import ImageModel from "../Components/ImageModel";
import video from "../../public/video.jpg";
import pdf from "../../public/pdf.png";
import ppt from "../../public/ppt.png";
import zip from "../../public/zip.png";
import doc from "../../public/doc.png";
import xls from "../../public/xls.png";
import ChatInput from "./ChatInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


let userList = [];

function ChatContainer({ currentChat, currentUser, onlineUser, setChatMsgData, handlehide, setShowChat }) {
  console.log(handlehide, 'handlehide')
  console.log(onlineUser, 'onlineUseronlineUserchat')
  const [message, setMessage] = useState([]);
  const [getMsg, setGetMsg] = useState();
  const [data, setData] = useState(5);
  const [loadding, setLoadding] = useState(true);
  const [showImg, setShowImg] = useState(false);
  const [Img, setImg] = useState(null);
  const scroll = useRef(null);
  const [chatGptImg, setChatGptImg] = useState(false);
  const msgBox = document.getElementById("scrollTop");

  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width >= 768;

  console.log(isMobile, 'isMobile')
  //handle msg(database,socket,and fronte nd)
  const handleSendChat = async (msg, type) => {
    const data = {
      from: currentUser.id,
      to: currentChat._id,
      message: msg,
      msg_type: type,
    };
    const response = await postdata("message/sendMessage", data);
    const res = await response.json();

    socket.emit("send-msg", {
      from: currentUser?.id,
      to: currentChat?._id,
      socketid: currentChat?.socketid,
      message: msg,
      msg_type: type,
    });
    const info = [...message];
    info.push({ fromSelf: true, message: msg, msg_type: type });
    setMessage(info);
  };
  //handle ImagehandleSendImage
  const handleSendImage = async (file, type) => {
    const data = new FormData();
    data.append("image", file);
    data.append("from", currentUser.id);
    data.append("to", currentChat._id);
    data.append("msg_type", type);
    const response = await postimage("message/sendImage", data);
    const res = await response.json();
    if (res.status == 400) {
      errorToast(res.error);
    }

    const info = [...message];
    info.push({ fromSelf: true, attechment: res.data, msg_type: type });
    setMessage(info);

    socket.emit("send-msg", {
      from: currentUser.id,
      to: currentChat._id,
      attechment: res.data,
      msg_type: type,
    });
  };
  //get message from the database
  const getmessage = async () => {
    const data = {
      from: currentUser.id,
      to: currentChat._id,
    };
    const response = await postdata("message/getAllMessage", data);
    const res = await response.json();
    console.log(res, 'res')
    setMessage(res.message);
    setLoadding(false);
  };

  //change message status seen or unseen
  const changeStatus = async () => {
    const data = {
      to: currentUser?.id,
      from: currentChat?._id,
    };
    const res = await postdata("message/changeStatus", data);
  };

  const viewMore = async () => {
    setData(data + 5);
  };
  const handleScroll = () => {
    const scrolldown = msgBox.scrollHeight - msgBox.scrollTop;
    if (scrolldown >= msgBox.scrollHeight) {
      viewMore();
    }
  };

  useEffect(() => {
    msgBox?.addEventListener("scroll", handleScroll);
    return () => {
      msgBox?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setChatMsgData(message)
  }, [message])

  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (data) => {
        if (data.to === currentChat._id) {
          if (data.message) {
            setGetMsg({
              fromSelf: false,
              message: data.message,
              msg_type: data.msg_type,
            });
          } else {
            setGetMsg({
              fromSelf: false,
              attechment: data.attechment,
              msg_type: data.msg_type,
            });
          }
        } else {
          setGetMsg();
        }
      });
    }
  }, []);

  useEffect(() => {
    {
      getMsg && setMessage([...message, getMsg]);
    }
  }, [getMsg]);

  useEffect(() => {
    changeStatus();
  }, [message]);
  useEffect(() => {
    setData(10);
    getmessage();
  }, [currentChat]);
  useEffect(() => {
    const div = scroll.current;
    if (div) {
      div.scroll({ top: div.scrollHeight, left: 0, behavior: "smooth" });
    }
  }, [message]);

  const handleDownload = (Img) => {
    let URL;
    if (chatGptImg) {
      URL = Img;
      saveAs(URL, "image.png");
    } else {
      URL = `https://chat-app-backend-l2a8.onrender.com/public/${Img}`;
      saveAs(URL, Img);
    }
  };
  const isCurrentUserOnline = onlineUser.some((user) => user?.userID === currentChat?._id);
  console.log(currentChat, 'currentChat')
  console.log(onlineUser, 'onlineUser')
  return (
    <>
      {/* <ToastContainer /> */}
      <div className="chat-container">
        <div className="back-chat-icon">
          {!isMobile ? (
            <div className="back-icon" onClick={() => handlehide()}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          ) : null}
          <div className="user-container">

            <div className="user-status">
              {isCurrentUserOnline ?
                <div className="user-profile">
                  <div className="online-user">
                    <img className="profile-img" src={noDP} alt=" "></img>
                    <div className="online"></div>
                  </div>
                  <div>
                    <div> {currentChat?.name}</div>
                    <div className="user-status">Active now</div></div>
                </div>
                :
                <div className="user-profile">
                  <div className="online-user">
                    <img className="profile-img" src={noDP} alt=" "></img>
                  </div>
                  <div>
                    <div> {currentChat?.name}</div>
                    <div className="user-status">Offline</div></div>
                </div>
              }
            </div>
            <div className="search-user-msg">
              <div className="icon-color">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <div className="icon-color">
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            </div>

          </div>
        </div>
        <div id="scrollTop" className="messages-container" ref={scroll}>
          {loadding ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            message &&
            message.slice(-data).map((data, index) => {
              const ext = data.attechment?.split(".").pop();
              return (
                <div
                  key={index}
                  className={
                    data.fromSelf ? "messages-send" : "messages-rececive"
                  }
                >
                  {data.message && (
                    <>
                      <div className={data.fromSelf ? "your-message" : "chat-msg-data"}>
                        <div> <img className="profile-img" src={noDP} alt=" " style={{ width: "70px", height: "70px" }}></img></div>
                        <div>
                          <div className="time-user-chat">
                            <div>{data?.fromSelf ? <span className="you-text ml-2">you</span> : <div className="you-text"> {currentChat?.name}</div>}</div>
                            <span className="time">
                              {moment(
                                data.createdAt ? data.createdAt : new Date()
                              ).format("h:mm: a")}
                            </span>
                          </div>
                          <p
                            className={data.fromSelf ? "sender-msg" : "receiver-msg"}
                          >
                            {data.message}
                            <br></br>
                          </p>
                        </div>
                      </div>

                    </>
                  )}
                  {console.log(video, 'video')}
                  {data.attechment &&
                    (data.attechment &&
                      (ext == "png" || ext == "jpeg" || ext == "jpg") ? (
                      <img
                        src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                        style={{
                          height: "190px",
                          width: "213px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && ext == "mp4" ? (
                      <video
                        src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                        autoPlay
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && ext == "ppt" ? (
                      <img
                        src={ppt}
                        style={{
                          height: "120px",
                          width: "120px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && ext == "zip" ? (
                      <img
                        src={zip}
                        style={{
                          height: "120px",
                          width: "120px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && (ext == "xls" || ext == "xlsx") ? (
                      <img
                        src={xls}
                        style={{
                          height: "120px",
                          width: "120px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && (ext == "docx" || ext == "doc") ? (
                      <img
                        src={doc}
                        style={{
                          height: "120px",
                          width: "120px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : (
                      <img
                        src={pdf}
                        style={{
                          height: "120px",
                          width: "120px",
                          border: "2px solid #d9d9d9",
                          borderRadius: "10px"
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ))}

                </div>
              );
            })
          )}
          {showImg ? (
            <ImageModel
              Img={Img}
              setShowImg={setShowImg}
              chatGptImg={chatGptImg}
            />
          ) : null}
          <div ref={scroll}></div>
        </div>
      </div>
      <div className="chat-send-msg-input">
        {/* <div className="type"></div> */}
        <div className="chat-input">
          <ChatInput
            handleSendChat={handleSendChat}
            handleSendImage={handleSendImage}
          />
        </div>
      </div>
    </>
  );
}

export default ChatContainer;
