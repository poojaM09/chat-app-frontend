import ChatInput from "./ChatInput";
import { postdata, getdata, postimage } from "../Utils/http.class";
import { useEffect, useRef, useState } from "react";
import "../assets/CSS/chatcontainer.css";
import { socket } from "../socket";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/fevicon-logo.svg";
import moment from "moment";
import DownloadIcon from "../../public/downloadIcon.svg"
import { errorToast } from "../Components/Toast";
import Loader from "../Components/Loader";
import ImageModel from "../Components/ImageModel";
import ImageSend from "../../public/double-tick-icon.svg"
import pdf from "../../public/pdf.png";
import ppt from "../../public/ppt.png";
import png from "../../public/png.png";
import mp4 from "../../public/mp4.png";
import zip from "../../public/zip.png";
import doc from "../../public/doc.png";
import xls from "../../public/xls.png";
import svg from "../../public/svg.png";
import jpg from "../../public/jpg.png";
import txt from "../../public/txt-file.png";
import webp from "../../public/webp.png"
import { useSelector, useDispatch } from "react-redux";
import NavigationBar from "../Components/NavigationBar"
let userList = [];

function ClientChatConatainer() {
    const [message, setMessage] = useState([]);
    const [BD, setBD] = useState([]);
    const [getMsg, setGetMsg] = useState();
    const [data, setData] = useState(5);
    const [loadding, setLoadding] = useState(true);
    const [showImg, setShowImg] = useState(false);
    const [Img, setImg] = useState(null);
    const scroll = useRef(null);
    const [chatGptImg, setChatGptImg] = useState(false);
    const storedDataString = localStorage.getItem('client')
    const parsedData = JSON.parse(storedDataString);
    const msgBox = document.getElementById("scrollTop");
    const [onlineUser, setOnlineUser] = useState([]);
    const [oUser, setOUser] = useState([]);
    const [chatUser, setChatUser] = useState([])
    const [contact, setContact] = useState();
    const [imgdownloading, setImgDownloading] = useState(false);
    const [mp4downloading, setmp4Downloading] = useState(false);
    const [pptdownloading, setpptDownloading] = useState(false);
    const [zipdownloading, setzipDownloading] = useState(false);
    const [xlsdownloading, setxlsDownloading] = useState(false);
    const [docdownloading, setdocDownloading] = useState(false);
    const [pdfdownloading, setpdfDownloading] = useState(false);
    const [txtdownloading, settxtDownloading] = useState(false);
    const [downloadingImage, setDownloadingImage] = useState(null);
    let currentUser = parsedData?._id
    const DataGet = localStorage.getItem('currentChat')
    const currentChat = JSON.parse(DataGet)
    const { isLoggin, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            socket.emit("add-client", user?.id);
        }
    }, [user]);

    const getUsers = async () => {
        const res = await getdata("user/getUser");
        const response = await res.json();
        setContact(response.users);
    };

    useEffect(() => {
        getUsers();
    }, []);

    const getUsersID = async () => {
        const data = {
            "id": currentChat?._id
        }
        const res = await postdata("user/getbyid", data);
        const response = await res.json();
        setChatUser(response.users)
    };

    useEffect(() => {
        getUsersID();
    }, []);

    userList = contact?.map((data) => data);

    useEffect(() => {
        if (socket) {
            socket.on("online-user", (data) => {
                setOUser(data)
                data.forEach((element) => {
                    let index = userList?.findIndex((item) => item?._id == element?.userID);
                    if (index >= 0) {
                        userList[index].socketid = data.socketId;
                    }
                });
                setOnlineUser(data);
            });
        }
    }, [socket, userList]);

    const handleSendChat = async (msg, type) => {
        const data = {
            from: currentUser,
            to: currentChat?._id,
            message: msg,
            msg_type: type,
        };

        const response = await postdata("message/sendMessage", data);
        const res = await response.json();
        socket.emit("send-msg", {
            from: currentUser,
            to: currentChat?._id,
            socketid: currentChat?.socketid,
            message: msg,
            msg_type: type,
        });
        const info = [...message];
        info.push({ fromSelf: true, message: msg, msg_type: type });
        setMessage(info);
    };

    const handleSendImage = async (file, type) => {
        const sendingMessage = {
            fromSelf: true,
            loading: true,
            msg_type: type,
            id: Date.now(),
        };
        setMessage((prevMessages) => [...prevMessages, sendingMessage]);
        const data = new FormData();
        data.append("image", file);
        data.append("from", currentUser);
        data.append("to", currentChat?._id);
        data.append("msg_type", type);
        const response = await postimage("message/sendImage", data);
        const res = await response.json();
        if (res.status === 400) {
            errorToast(res.error);
        } else {
            setMessage((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const sendingMessageIndex = updatedMessages.findIndex((message) => message === sendingMessage);
                if (sendingMessageIndex !== -1) {
                    updatedMessages.splice(sendingMessageIndex, 1);
                    updatedMessages.push({ fromSelf: true, attechment: res?.data, msg_type: type, loading: false, });
                }
                return updatedMessages;
            });

            socket.emit("send-msg", {
                from: currentUser,
                to: currentChat?._id,
                attechment: res?.data,
                msg_type: type,
            });
        }
    };

    const getmessage = async () => {
        const data = {
            id: currentUser,
        };
        const response = await postdata("message/userMessage", data);
        const res = await response.json();
        setBD(res)
        setTimeout(() => {
            setLoadding(false);
            setMessage(res.message);
          }, 2000);
    };

    const changeStatus = async () => {
        const data = {
            to: currentUser,
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
        if (socket) {
            socket.on("msg-recieve", (data) => {
                if (data.to === currentChat?._id) {
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
        setLoadding(true);
        setData(10);
        getmessage();
    }, []);

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
        } else if (part2 === 'mp4' || part2 == 'mkv' || part2 == "webm") {
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

    return (
        <>
            <NavigationBar />
            <div className="chat-container">
                <div className="back-chat-icon user-container">
                    <div className="d-flex align-items-center">
                        <img className="imgs" src={logo} alt=""></img>
                        <p className="medium-title ml-3 mb-0">{"Plutustec"}</p>
                    </div>
                </div>
                <div id="scrollTop" className="messages-container" ref={scroll}>
                    {message.length > 10 && (
                        <div className="view-btn">
                            <button className="view-more-button text-uppercase" onClick={() => viewMore()}>
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
                                            <div className={data.fromSelf ? "your-message" : "chat-msg-data"}>
                                                <div>
                                                    {data.fromSelf ?
                                                        <span className="avatar_circle d-flex align-items-center justify-content-center mr-0">{user?.name?.charAt(0) && user?.name?.charAt(0)}</span>
                                                        :
                                                        <img className="profile-img img-fluid" src={logo} alt="plutus" width={70} height={70} />
                                                    }
                                                </div>
                                                <div className="ml-2 mr-2">
                                                    <div className="time-user-chat">
                                                        <div>{data?.fromSelf ? <span className="you-text ml-2">you</span> : <div className="you-text"> {'Plutustec'}</div>}</div>
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
                                                    </p>
                                                </div>
                                            </div>

                                        </>
                                    )}
                                    {data?.loading && (
                                        <div className="file-displys position-relative">
                                            <div>
                                                <div style={{ position: "relative" }}>
                                                    <img src={webp} style={{ filter: "blur(4px)" }} />
                                                </div>
                                                <div style={{ position: "absolute", top: "50px", left: "38%" }}><img style={{ height: "30px" }} src={DownloadIcon}
                                                /></div>
                                            </div>
                                        </div>
                                    )}
                                    {data?.attechment &&
                                        (data?.attechment &&
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
                                        ) : data.attechment && ext == "mp4" || ext == 'mkv' || ext == 'webm' ? (

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
                                                            {downloadingImage === data.attechment && (
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
                                                            {downloadingImage === data.attechment && (
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
                                                            {downloadingImage === data.attechment && (
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
                                                            {downloadingImage === data.attechment && (
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
                                                            src={txt}
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
                                                            {downloadingImage === data.attechment && (
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
                                                            {downloadingImage === data.attechment && (
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
            </div>
            <div className="chat-send-msg-input">
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

export default ClientChatConatainer;