import React, { useEffect, useRef, useState } from "react";
import { postdata, postimage } from "../Utils/http.class";
import moment from "moment";
import { socket } from "../socket";
import noDP from "../../public/profile-user.png";
import BDProfile from "../../public/fevicon-logo.svg";
import Loader from "../Components/Loader";
import ImageModel from "../Components/ImageModel";
import ImageSend from "../../public/double-tick-icon.svg"
import DownloadIcon from "../../public/downloadIcon.svg"
import pdf from "../../public/pdf.png";
import ppt from "../../public/ppt.png";
import zip from "../../public/zip.png";
import doc from "../../public/doc.png";
import xls from "../../public/xls.png";
import txt from "../../public/txt-file.png";
import png from "../../public/png.png";
import jpg from "../../public/jpg.png";
import mp4 from "../../public/mp4.png";
import ViewMore from "../../public/view-more.svg";
import ChatInput from "./ChatInput";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ChatContainer({ currentChat, currentUser, onlineUser, setChatMsgData, handlehide, setShowChat }) {

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
  const [txtdownloading, settxtDownloading] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(null);
  const [showDownloadIcon, setShowDownloadIcon] = useState(false);


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


  // const handleSendImage = async (file, type) => {
  //   const sendingMessage = { fromSelf: true, SendFile:file.path, msg_type:type,className:'ddddd'};
  //   setMessage((prevMessages) => [...prevMessages, sendingMessage]);
  //   const data = new FormData();
  //   data.append("image", file);
  //   data.append("from", currentUser.id);
  //   data.append("to", currentChat._id);
  //   data.append("msg_type", type);
  //   const response = await postimage("message/sendImage", data);
  //   const res = await response.json();
  //   if (res.status === 400) {
  //     errorToast(res.error);
  //   } else {
  //     setMessage((prevMessages) => {
  //       const updatedMessages = [...prevMessages];
  //       const sendingMessageIndex = updatedMessages.findIndex((message) => message === sendingMessage);
  //       if (sendingMessageIndex !== -1) {
  //         updatedMessages.splice(sendingMessageIndex, 1);
  //         updatedMessages.push({ fromSelf: true, attechment: res.data, msg_type: type });
  //       }
  //       return updatedMessages;
  //     });

  //     // Emit a socket event to notify that the image was sent
  //     socket.emit("send-msg", {
  //       from: currentUser.id,
  //       to: currentChat._id,
  //       attechment: res.data,
  //       msg_type: type,
  //     });
  //   }
  // };

  //get message from the database
  const getmessage = async () => {
    const data = {
      from: currentUser.id,
      to: currentChat._id,
    };
    const response = await postdata("message/getAllMessage", data);
    const res = await response.json();
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
    const newData = data + 5;
    if (newData >= message.length) {
      setNoMoreMessages(true);
    }
    setData(newData);
  };

  useEffect(() => {
    if (message.length > data) {
      setNoMoreMessages(false);
    }
  }, [message, data]);
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
    setDownloadingImage(img)
    const lastIndex = img.lastIndexOf(".");
    const part2 = img.substring(lastIndex + 1);

    const resetDownloadingFlags = () => {
      setImgDownloading(false);
      setmp4Downloading(false);
      setzipDownloading(false);
      setpptDownloading(false);
      setxlsDownloading(false);
      setdocDownloading(false);
      setpdfDownloading(false);
      settxtDownloading(false);
      setDownloadingImage(false)
    };

    if (part2 === "png" || part2 === "jpeg" || part2 === "jpg" || part2 === "svg" || part2 === "webp") {
      setImgDownloading(true);
    } else if (part2 === 'mp4') {
      setmp4Downloading(true);
    } else if (part2 === 'zip') {
      setzipDownloading(true);
    } else if (part2 === 'ppt') {
      setpptDownloading(true);
    } else if (part2 === 'txt') {
      settxtDownloading(true);
    } else if (part2 === 'xls' || part2 === 'xlsx') {
      setxlsDownloading(true);
    } else if (part2 === 'doc' || part2 === 'docx') {
      setdocDownloading(true);
    } else {
      setpdfDownloading(true);
    }

    let URL;
    if (chatGptImg) {
      URL = img;
    } else {
      URL = `https://chat-app-backend-l2a8.onrender.com/public/${img}`;
    }

    const onSuccess = () => {
      resetDownloadingFlags();
    };

    const onError = () => {
      resetDownloadingFlags();
      toast.error('File not found. Please try again later.', {
        position: "top-center",
        autoClose: 3000,
      });
    };

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
        a.download = img;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        onSuccess();
      })
      .catch((error) => {
        onError();
      });
  };
  const storedDataString = localStorage.getItem('userList')
  const userList = JSON.parse(storedDataString);

  const isCurrentUserOnline = onlineUser?.some((user) => user?.userID === currentChat?._id);


  return (
    <>
      <div className="chat-container">
        <div className="back-chat-icon">
      
          {/* {isMobile == false ? (
            <div className="back-icon" onClick={() => handlehide()}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          ) : null} */}
          <div className="back-icon p-0 mr-2 d-block d-lg-none" onClick={() => handlehide()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 448 512">
              <path fill="#ff6c37" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </div>
          <div className="user-container">
            <div className="user-status">
              {isCurrentUserOnline ?
                <div className="user-profile align-items-center">
                  {userList.map((data) => {
                    if (data?._id === currentChat?._id) {
                      if (data?.contactNumber) {
                        return <div className="online-user"><span className="avatar_circle d-flex align-items-center justify-content-center">{currentChat?.name?.charAt(0) && currentChat?.name?.charAt(0)}</span>
                          <div className="online"></div>
                        </div>;
                      } else {
                        return <div className="online-user">
                          <img className="imgs" src={BDProfile} alt=" " key={data?.id} />
                          <div className="online"></div>
                        </div>;
                      }
                    }
                  })}
                  <div className="ml-3">
                    <div className="medium-title"> {currentChat?.name}</div>
                    <div className="user-status text-uppercase text-success">Active</div></div>
                </div>
                :
                <div className="user-profile align-items-center">
                  <div className="online-user">
                    {userList.map((data, index) => {

                      if (data?._id === currentChat?._id) {
                        if (data?.contactNumber) {
                          return <span key={index} className="avatar_circle d-flex align-items-center justify-content-center">{data?.name?.charAt(0) && data?.name?.charAt(0)}</span>;
                        } else {
                          return <img className="imgs" src={BDProfile} alt=" " key={data?.id} />;
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
          </div>
        </div >
        <div id="scrollTop" className="messages-container" ref={scroll}>
          {!noMoreMessages && message?.length >= 5 && (
            <div className="view-btn">
              <button className="view-more-button text-uppercase" onClick={viewMore}>
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
                    data?.fromSelf ? "messages-send" : "messages-rececive"
                  }
                >
                  {data?.message && (
                    <>
                      <div key={index} className={data?.fromSelf ? "your-message" : "chat-msg-data"}>
                        {userList.map((Users, index) => {
                          if (Users?._id === data?.from) {
                            if (Users?.contactNumber) {
                              return <span key={index} className="avatar_circle d-flex align-items-center justify-content-center">{currentChat?.name?.charAt(0) && currentChat?.name?.charAt(0)}</span>;
                            } else {
                              return <img className="imgs" src={BDProfile} alt=" " key={Users?._id} />;
                            }
                          }
                          if (Users?._id === data?.to) {
                            if (Users?.contactNumber) {
                              return <span key={index} className="avatar_circle d-flex align-items-center justify-content-center mr-0 ml-2">{currentUser?.name?.charAt(0) && currentUser?.name?.charAt(0)}</span>;
                            } else {
                              return <img className="imgs" src={BDProfile} alt=" " key={Users?._id} />;
                            }
                          }
                        })}
                        <div>
                          <div className="time-user-chat">
                            <>{data?.fromSelf ? <span className="you-text ml-2">you</span> : <span className="you-text"> {currentChat?.name}</span>}</>
                            <span className="time">
                              {moment(
                                data.createdAt ? data.createdAt : new Date()
                              ).format("h:mm: a")}
                            </span>
                          </div>
                          <p className={data.fromSelf ? "sender-msg" : "receiver-msg"}>
                            {data.message}
                            <br />
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {data.attechment &&
                    (data.attechment &&
                      (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "svg" || ext == "webp") ? (
                      <div className="file-displys position-relative">
                        {imgdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                src={
                                  (() => {
                                    switch (ext) {
                                      case "png":
                                        return png;
                                      case "jpeg":
                                      case "jpg":
                                        return jpg;
                                      case "svg":
                                        return svg;
                                      case "webp":
                                        return webp;
                                      default:
                                        return png;
                                    }
                                  })()
                                }
                                className="attched-file"
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />

                              {downloadingImage === data.attechment && (
                                <div className="img-loader">
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
                              src={
                                (() => {
                                  switch (ext) {
                                    case "png":
                                      return png;
                                    case "jpeg":
                                    case "jpg":
                                      return jpg;
                                    case "svg":
                                      return svg;
                                    case "webp":
                                      return webp;
                                    default:
                                      return png;
                                  }
                                })()
                              }
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
                              <img
                                className="attched-file"
                                src={mp4}
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
                            <img
                              className="attched-file"
                              src={mp4}
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
                    ) : data.attechment && (ext == "txt") ? (
                      <div className="file-displys position-relative">
                        {txtdownloading ? (
                          <>
                            <div className="position-relative">
                              <img
                                className="attched-file"
                                src={txt}
                                onClick={() => {
                                  handleDownload(data.attechment);
                                }}
                              />
                              {downloadingImage === data.attechment && (
                                <div className="img-loader">
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
                              src={txt}
                              onClick={() => {
                                handleDownload(data.attechment);
                              }}

                            />
                          </>
                        )}
                      </div>
                    )

                      : data.attechment && (ext == "docx" || ext == "doc") ? (

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
                                {downloadingImage === data.attechment && (
                                  <div className="img-loader">
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
                                {downloadingImage === data.attechment && (
                                  <div className="img-loader">
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
