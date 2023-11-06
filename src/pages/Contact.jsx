
import { useEffect } from "react";
import noDP from "../../public/profile-user.png";
import BDProfile from "../../public/fevicon-logo.svg";
import "../assets/CSS/contact.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { postdata } from "../Utils/http.class";
import { errorToast } from "../Components/Toast";
import Search from "../../public/search.svg";
import { faMagnifyingGlass, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

let userList = [];

function Contact({ handleCurrentChat, contact, currentUser, setOnlineUser, onlineUser, chatMsgData, handleShow }) {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState();
  const [notification, setNotification] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [items, setItems] = useState([]);
  const [searchDataFound, setsearchDataFound] = useState(false);
  userList = contact?.filter((data) => data._id !== currentUser.id);


  // Function to get the last message for a user
  // const getLastMessage = (userId) => {
  //   const userMessages = chatMsgData?.filter((msg) => msg.from === userId || msg.to === userId);
  //   console.log(userMessages, 'userMessages')
  //   const lastMessage = userMessages?.length > 0 ? userMessages[userMessages?.length - 1] : null;
  //   console.log(lastMessage, 'lastMessagelastMessage')
  //   return lastMessage;
  // };

  const getLastMessage = (userId) => {
    const userMessages = chatMsgData?.filter((msg) => msg.from === userId || msg.to === userId);
    const sortedMessages = userMessages?.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    return sortedMessages?.length > 0 ? sortedMessages[0] : null;
  };

  const getSenderUsername = (message) => {
    const AllMessage = userList?.map((users) => {
      console.log(users, 'usersusers')
      if (message?.from === users?._id) {
        return 'You';
      } else {
        const sender = userList?.find((user) => user?._id === message?.from);
        return sender ? sender.name : 'Unknown User';
      }
    })
  };

  //online user
  useEffect(() => {
    if (socket) {
      socket.on("online-user", (data) => {
        data.forEach((element) => {
          let index = userList?.findIndex((item) => item._id == element.userID);
          if (index >= 0) {
            userList[index].socketid = data.socketId;
          }
        });
        setOnlineUser(data);
      });
      socket.emit('getItems');
      socket.on('items', (data) => {
        setItems(data);
      });
      return () => {
        socket.off('items');
      };
    }
  }, [socket, userList]);

  localStorage.setItem('item', JSON.stringify(items))
  const storedItem = localStorage.getItem('item');
  const getItem = JSON.parse(storedItem);

  const userNotification = (user) => {
    let filterData;
    if (notification) {
      filterData =
        notification &&
        notification?.filter((note) => {
          localStorage.setItem("newMessage", JSON.stringify(note))
          return note?.from === user?._id;
        });
    } else {
      filterData = null;
    }
    return filterData;
  };

  userList = contact?.filter((data) => data._id !== currentUser.id);

  const newMessage = JSON.parse(localStorage.getItem("newMessage"));
  if (newMessage) {
    const userWithNewMessage = userList?.find((user) => user._id === newMessage.from);
    if (userWithNewMessage) {
      userList = userList.filter((user) => user._id !== userWithNewMessage._id);
      userList.unshift(userWithNewMessage);
    }
  }

  //get unseen message
  const viewMessage = async () => {
    const data = {
      to: currentUser.id,
    };
    const res = await postdata("message/isViewMessage", data);
    const response = await res.json();
    if (response.message == "You are Not verified") {
      errorToast(response.message);
    }
    setNotification(response.message);
  };

  //change status of message seen or unseen
  const changeStatus = async () => {
    const data = {
      to: currentUser.id,
      from: currentChat?._id,
    };

    const res = await postdata("message/changeStatus", data);
    const response = await res.json();
    if (response.message == "You are Not verified") {
      errorToast(response.message);
    }
  };

  const searchUser = async () => {
    const data = {
      search: search,
    };
    const res = await postdata("user/searchUser", data);
    const response = await res.json();
    console.log(response, 'responseresponse')
    if (response.message == "No result Found ") {
      setsearchDataFound(true)
    } else {
      setSearchData(response.user);
      setSearchLoader(false);
      setsearchDataFound(false)
    }
  };

  useEffect(() => {
    viewMessage();
    changeStatus();
  }, [currentChat]);

  useEffect(() => {
    viewMessage();
  }, []);

  useEffect(() => {
    searchUser();
  }, [search]);

  useEffect(() => {
    socket.on("msg-notification", () => {
      viewMessage();
    });
  }, []);

  localStorage.setItem("userList", JSON.stringify(userList))

  return (
    <>
      <div className="contact-conainer">
        <div className="searchContainer">
          <img src={Search} width={20} height={20} alt="Icon" />
          <input
            className="search-input"
            placeholder="Search here.."
            type="text"
            onChange={(e) => {
              setSearchLoader(true);
              setSearch(e.target.value);
            }}
          />
          {searchLoader ? (
            <div className="loader-line"></div>
          ) : (
            <div style={{ height: "1px" }}></div>
          )}

        </div>
        {searchDataFound && search.length !== 0 &&
          <div>
            Data Not Found
          </div>
        }
        {search == ""
          ? getItem?.map((data, index) => {

            const isOnline = onlineUser?.some(
              (user) => user?.userID === data?._id
            );
            const userNote = userNotification(data);
            const lastMessage = getLastMessage(data?._id);
            const senderUsername = lastMessage ? getSenderUsername(lastMessage) : '';

            return (
              <div
                key={index}
                className={
                  currentChat?._id === data._id
                    ? "wrapper selected-contact-name "
                    : "wrapper"
                }
                onClick={() => {
                  handleCurrentChat(data);
                  setCurrentChat(data);
                  handleShow()
                }}
              >
                <div className="position-relative">
                  {data?.contactNumber ? (
                    <span className="avatar_circle d-flex align-items-center justify-content-center">{data?.name?.charAt(0) && data?.name?.charAt(0)}</span>
                  ) :
                    <img className="imgs mr-2" width={32} height={32} src={BDProfile} alt=" " />
                  }
                  {isOnline ? <div className="online"></div> : null}
                </div>
                <div className="contact-name">{data?.name}</div>
                {currentChat?._id === data?._id
                  ? " "
                  : userNote.length > 0 && (
                    <div className="notification">{userNote?.length}</div>
                  )}
              </div>
            );
          })
          : searchData?.map((data, index) => {
            const isOnline = onlineUser?.some(
              (user) => user?.userID === data?._id
            );

            const userNote = userNotification(data);
            const lastMessage = getLastMessage(data._id);
            const senderUsername = lastMessage ? getSenderUsername(lastMessage) : '';
            return (
              <>
                <div
                  key={index}
                  className="wrapper"
                  onClick={() => {
                    handleCurrentChat(data);
                    setCurrentChat(data);
                  }}
                >
                  <div className="contact-img">
                    {data.contactNumber ? (
                      //  <img className="img" src={noDP} alt=" " />
                      <span className="avatar_circle d-flex align-items-center justify-content-center">{data?.name?.charAt(0) && data?.name?.charAt(0)}</span>
                    ) :
                      <img className="imgs mr-2" width={32} height={32} src={BDProfile} alt=" " />
                    }
                  {  console.log(isOnline,'isOnlineisOnline')}
                    {isOnline ? <div className="online"></div> : null}
                  </div>
                  <div className="contact-name">
                    <p style={{ color: "black" }}>{data?.name}</p>
                  </div>
                  {currentChat?._id === data?._id
                    ? " "
                    : userNote?.length > 0 && (
                      <>
                        <div className="notification">{userNote?.length}</div>
                      </>
                    )}
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}

export default Contact;

