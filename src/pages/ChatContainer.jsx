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
import ViewMore from "../../public/view-more.svg"; 
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
                <div className="user-profile align-items-center">
                  <div className="online-user">
                    {/* <img className="profile-img" src={noDP} alt=" "></img> */}
                    <span className="avatar_circle d-flex align-items-center justify-content-center">{currentChat?.name.charAt(0) && currentChat?.name.charAt(0)}</span>
                    <div className="online"></div>
                  </div>
                  <div className="ml-3">
                    <div className="medium-title"> {currentChat?.name}</div>
                    <div className="user-status text-uppercase text-success">Active</div></div>
                </div>
                :
                <div className="user-profile align-items-center">
                  <div className="online-user">
                    {userList.map((data) => {
                      console.log("data.id:", data._id);
                      console.log("currentChat._id:", currentChat._id);
                      console.log("data?.contactNumber:", data?.contactNumber);

                      if (data._id === currentChat._id) {
                        if (data?.contactNumber) {
                          return <span className="avatar_circle d-flex align-items-center justify-content-center">{data?.name.charAt(0) && data?.name.charAt(0)}</span>;
                        } else {
                          return <img className="imgs" src={BDProfile} alt=" " key={data.id} />;
                        }
                      }
                    })}
                  </div>
                  <div className="ml-3">
                    <div className="medium-title"> {currentChat?.name}</div>
                    <div className="user-status text-uppercase text-danger">Offline</div></div>
                </div>
              }
            </div>
            {/* <div className="search-user-msg">
              <div className="icon-color">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <div className="icon-color">
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            </div> */}

          </div>
        </div >
        <div id="scrollTop" className="messages-container" ref={scroll}>
          
        {!noMoreMessages && (
            <div className="view-btn">
              <button className="view-more-button text-uppercase" onClick={() => viewMore()}>
                view more
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
                              // <img className="profile-img" style={{ width: "70px", height: "70px" }} src={noDP} alt=" " key={Users.id} />
                              return <span className="avatar_circle d-flex align-items-center justify-content-center">{currentChat?.name.charAt(0) && currentChat?.name.charAt(0)}</span>;
                            } else {
                              return <img className="imgs" src={BDProfile} alt=" " key={Users.id} />;
                            }
                          }
                          if (Users._id === data?.to) {
                            console.log(Users._id === data?.to,'Users._id === data?.toUsers._id === data?.to')
                            if (Users?.contactNumber ){
                              console.log(Users?.contactNumber,'gfdfdsf')
                              return <span className="avatar_circle d-flex align-items-center justify-content-center mr-0 ml-2">{currentChat?.name.charAt(0) && currentChat?.name.charAt(0)}</span>;
                            } else {
                              return <img className="imgs" src={BDProfile} alt=" " key={Users.id} />;
                            }
                          }
                        })}
                        {/* <div> <img className="profile-img" src={noDP} alt=" " style={{ width: "70px", height: "70px" }}></img></div> */}

                        <div>
                          <div className="time-user-chat">
                            <>{data?.fromSelf ? <span className="you-text ml-2">you</span> : <span className="you-text"> {currentChat?.name}</span>}</>
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
                      <div className="file-displys position-relative">
                        {imgdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                                className="attched-file" 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {imgdownloading && (
                                <div
                                 className="img-loader" 
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
                              className="attched-file"
                              src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`} 
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}
                            />
                          </>
                        )}
                      </div>
                    ) : data.attechment && ext == "mp4" ? (

                      <div className="file-displys position-relative">
                        {mp4downloading ? (
                          <>
                            <div className="position-relative">
                              <video
                                className="attched-file"
                                src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                                autoPlay 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {mp4downloading && (
                                <div
                                  className="img-loader" 
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
                              className="attched-file"
                              src={`https://chat-app-backend-l2a8.onrender.com/public/${data.attechment}`}
                              autoPlay 
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}
                            />
                          </>
                        )}
                      </div>

                    ) : data.attechment && ext == "ppt" ? (


                      <div className="file-displys position-relative">
                        {pptdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                className="attched-file"
                                src={ppt} 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {pptdownloading && (
                                <div
                                  className="img-loader" 
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
                              className="attched-file"
                              src={ppt} 
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}
                            />
                          </>
                        )}
                      </div>


                    ) : data.attechment && ext == "zip" ? (
                      <div className="file-displys position-relative">
                        {zipdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                className="attched-file"
                                src={zip} 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {zipdownloading && (
                                <div
                                className="img-loader" 
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
                              className="attched-file"
                              src={zip} 
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}
                            />
                          </>
                        )}
                      </div>
                    ) : data.attechment && (ext == "xls" || ext == "xlsx") ? (
                      <div className="file-displys position-relative">
                        {xlsdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                className="attched-file"
                                src={xls} 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {xlsdownloading && (
                                <div
                                  className="img-loader" 
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
                              className="attched-file"
                              src={xls} 
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}

                            />
                          </>
                        )}
                      </div>
                    ) : data.attechment && (ext == "docx" || ext == "doc") ? (

                      <div className="file-displys position-relative">
                        {docdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                className="attched-file"
                                src={doc} 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {docdownloading && (
                                <div
                                className="img-loader" 
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
                              className="attched-file"
                              src={doc} 
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="file-displys position-relative">
                        {pdfdownloading ? (
                          <>
                            <div className="position-relative"> 
                              <img
                                className="attched-file"
                                src={pdf} 
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {pdfdownloading && (
                                <div 
                                  className="img-loader" 
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
                              className="attched-file"
                              src={pdf} 
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
          <ChatInput
            handleSendChat={handleSendChat}
            handleSendImage={handleSendImage}
          /> 
      </div>
    </>
  );
}

export default ChatContainer;
