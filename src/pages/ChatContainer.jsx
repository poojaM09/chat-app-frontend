import React, { useEffect, useRef, useState } from "react";
import { postdata, postimage } from "../Utils/http.class";
import moment from "moment";
import { socket } from "../socket";
import noDP from "../../public/profile-user.png";
import BDProfile from "../../public/fevicon-logo.svg";
import Loader from "../Components/Loader";
import ImageModel from "../Components/ImageModel";
import ImageSend from "../../public/double-tick-icon.svg"
import video from "../../public/video.jpg";
import pdf from "../../public/pdf.png";
import ppt from "../../public/ppt.png";
import zip from "../../public/zip.png";
import doc from "../../public/doc.png";
import xls from "../../public/xls.png";
import ChatInput from "./ChatInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




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
  const [imgdownloading, setImgDownloading] = useState(false);
  const [mp4downloading, setmp4Downloading] = useState(false);
  const [pptdownloading, setpptDownloading] = useState(false);
  const [zipdownloading, setzipDownloading] = useState(false);
  const [xlsdownloading, setxlsDownloading] = useState(false);
  const [docdownloading, setdocDownloading] = useState(false);
  const [pdfdownloading, setpdfDownloading] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  console.log(data, 'data')

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
    // Load more messages and check if there are more messages
    const newData = data + 5;
    if (newData >= message.length) {
      setNoMoreMessages(true);
    }
    setData(newData);
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

  const handleDownload = (img) => {
    const lastIndex = img.lastIndexOf(".");
    const part2 = img.substring(lastIndex + 1);

    const downloadFile = (URL, filename, onSuccess) => {
      fetch(URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error('File not found');
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          onSuccess();
        })
        .catch((error) => {
          // Handle download error, e.g., 404
          setImgDownloading(false);
          setmp4Downloading(false);
          setzipDownloading(false);
          setpptDownloading(false);
          setxlsDownloading(false);
          setdocDownloading(false);
          setpdfDownloading(false);

          toast.error('File not found. Please try again later.', {
            position: "top-center",
            autoClose: 3000, // Duration in milliseconds
          });
        });
    };

    if (
      !imgdownloading &&
      (part2 === 'png' || part2 === 'jpeg' || part2 === 'jpg')
    ) {
      setImgDownloading(true);
    } else if (!mp4downloading && part2 === 'mp4') {
      setmp4Downloading(true);
    } else if (!zipdownloading && part2 === 'zip') {
      setzipDownloading(true);
    } else if (!pptdownloading && part2 === 'ppt') {
      setpptDownloading(true);
    } else if (
      (!xlsdownloading && part2 === 'xls') ||
      (!xlsdownloading && part2 === 'xlsx')
    ) {
      setxlsDownloading(true);
    } else if (
      (!docdownloading && part2 === 'doc') ||
      (!docdownloading && part2 === 'docx')
    ) {
      setdocDownloading(true);
    } else if (!pdfdownloading) {
      setpdfDownloading(true);
    }

    let URL;
    if (chatGptImg) {
      URL = img;
    } else {
      URL = `https://chat-app-backend-l2a8.onrender.com/public/${img}`;
    }

    downloadFile(URL, img, () => {
      // Simulate download completion with a delay
      setTimeout(() => {
        setImgDownloading(false);
        setmp4Downloading(false);
        setzipDownloading(false);
        setpptDownloading(false);
        setxlsDownloading(false);
        setdocDownloading(false);
        setpdfDownloading(false);
      }, 2000);
    });
  };


  const storedDataString = localStorage.getItem('userList')
  const userList = JSON.parse(storedDataString);

  const isCurrentUserOnline = onlineUser.some((user) => user?.userID === currentChat?._id);
  console.log(isCurrentUserOnline, 'isCurrentUserOnlineisCurrentUserOnline')
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
                    {userList.map((data) => {
                      console.log("data.id:", data._id);
                      console.log("currentChat._id:", currentChat._id);
                      console.log("data?.contactNumber:", data?.contactNumber);

                      if (data._id === currentChat._id) {
                        if (data?.contactNumber) {
                          return <img className="profile-img" src={noDP} alt=" " key={data.id} />;
                        } else {
                          return <img className="imgs" src={BDProfile} alt=" " key={data.id} />;
                        }
                      }
                    })}
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
        </div >
        <div id="scrollTop" className="messages-container" ref={scroll}>
          {!noMoreMessages && (
            <div className="view-btn">
              <button className="view-more-button" onClick={() => viewMore()}>
                View more
              </button>
            </div>
          )}
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
                      {console.log(data, 'data212121212')}
                      <div className={data.fromSelf ? "your-message" : "chat-msg-data"}>
                        {userList.map((Users) => {
                          if (Users._id === data?.from) {
                            console.log(Users._id === data?.from,'Users._id === data?.from')
                            if (Users?.contactNumber ){
                              console.log(Users?.contactNumber,'gfdfdsf')
                              return <img className="profile-img" style={{ width: "70px", height: "70px" }} src={noDP} alt=" " key={Users.id} />;
                            } else {
                              return <img className="imgs" src={BDProfile} alt=" " key={Users.id} />;
                            }
                          }
                          if (Users._id === data?.to) {
                            console.log(Users._id === data?.to,'Users._id === data?.toUsers._id === data?.to')
                            if (Users?.contactNumber ){
                              console.log(Users?.contactNumber,'gfdfdsf')
                              return <img className="profile-img" style={{ width: "70px", height: "70px" }} src={noDP} alt=" " key={Users.id} />;
                            } else {
                              return <img className="imgs" src={BDProfile} alt=" " key={Users.id} />;
                            }
                          }
                        })}
                        {/* <div> <img className="profile-img" src={noDP} alt=" " style={{ width: "70px", height: "70px" }}></img></div> */}

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
                  {console.log(data.attechment, 'video')}
                  {data.attechment &&
                    (data.attechment &&
                      (ext == "png" || ext == "jpeg" || ext == "jpg") ? (
                      <div style={{ position: "relative" }}>
                        {imgdownloading ? (
                          <>
                            <div style={{ position: 'relative' }}>
                              <img
                                src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                                style={{
                                  height: '190px',
                                  width: '213px',
                                  border: '2px solid #d9d9d9',
                                  borderRadius: '10px',
                                }}
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {imgdownloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
                            <img
                              src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                              style={{
                                height: '190px',
                                width: '213px',
                                border: '2px solid #d9d9d9',
                                borderRadius: '10px',
                              }}
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}
                            />
                          </>
                        )}
                      </div>
                    ) : data.attechment && ext == "mp4" ? (

                      <div style={{ position: 'relative' }}>
                        {mp4downloading ? (
                          <>
                            <div style={{ position: 'relative' }}>
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
                              {mp4downloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
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
                          </>
                        )}
                      </div>

                    ) : data.attechment && ext == "ppt" ? (


                      <div style={{ position: 'relative' }}>
                        {pptdownloading ? (
                          <>
                            <div style={{ position: 'relative' }}>
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
                              {pptdownloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
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
                          </>
                        )}
                      </div>


                    ) : data.attechment && ext == "zip" ? (
                      <div style={{ position: 'relative' }}>
                        {zipdownloading ? (
                          <>
                            <div style={{ position: 'relative' }}>
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
                              {zipdownloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
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
                          </>
                        )}
                      </div>
                    ) : data.attechment && (ext == "xls" || ext == "xlsx") ? (
                      <div style={{ position: 'relative' }}>
                        {xlsdownloading ? (
                          <>
                            <div style={{ position: 'relative' }}>
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
                              {xlsdownloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
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
                          </>
                        )}
                      </div>
                    ) : data.attechment && (ext == "docx" || ext == "doc") ? (

                      <div style={{ position: 'relative' }}>
                        {docdownloading ? (
                          <>
                            <div style={{ position: 'relative' }}>
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
                              {docdownloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
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
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        {pdfdownloading ? (
                          <>
                            <div style={{ position: 'relative' }}>

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
                              {pdfdownloading && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <Loader />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <img src={ImageSend} className="seenIcon" />
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
                          </>
                        )}
                      </div>
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
      </div >
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
