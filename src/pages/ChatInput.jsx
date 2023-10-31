import Picker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import "../assets/CSS/chat-input.css";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { errorToast } from "../Components/Toast";
import Emoji from "../../public/chat-emoji.svg";
import PaperClip from "../../public/paperclip.svg";
import Send from "../../public/send.svg";

function ChatInput({ handleSendChat, handleSendImage }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState([]);
  const [attechment, setAttechment] = useState(null);
  const [selected, setSelected] = useState(false);

  const [type, setType] = useState("");

  const { getInputProps, getRootProps, fileRejections } = useDropzone({
    accept: [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "application/pdf",
      "text/html",
      "text/plain",
      "application/x-zip-compressed",
      "application/zip",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "video/mp4",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
      "image/webp",
    ],

    onDrop: async (acceptFile) => {
      if (validation(acceptFile[0])) {
        setAttechment(
          Object.assign(acceptFile, {
            preview: URL.createObjectURL(acceptFile[0]),
          })
        );
      }
    },
  });
  useEffect(() => {
    if (attechment) {
      sendChat();
    }
  }, [attechment]);

  const validation = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      errorToast("invalid size lenth");
      setAttechment(null);
      setSelected(false);
      return false;
    }
    if (
      file.type != "image/jpeg" &&
      file.type != "image/png" &&
      file.type != "image/jpeg" &&
      file.type != "image/webp" &&
      file.type !=   "image/svg+xml" &&
      file.type != "application/pdf" &&
      file.type != "text/html" &&
      file.type != "text/plain" &&
      file.type != "application/x-zip-compressed" &&
      file.type != "application/vnd.ms-excel" && 
      file.type !=  "application/vnd.ms-powerpoint" &&
       file.type != "application/zip" &&
      file.type !=
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      file.type != "video/mp4"
    ) {
      errorToast("invalid type !!!");
      setAttechment(null);
      setSelected(false);
      return false;
    }
    setSelected(true);
    setType(file.type);
    return true;
  };

  const setEmoji = (emoji, event) => {
    setMsg((prevMsg) => prevMsg + emoji.emoji);
  };
 
  const sendChat = () => {
    if (attechment) {
      handleSendImage(attechment[0], type && type);
      setAttechment(null);
    } else if (msg) {
      handleSendChat(msg, "message");
    }
    setMsg("");
    setSelected(false);
    setShowEmoji(false);
    setType(null);
  };

  return (
    <>
      <div className="input-container">
        <form
          className="send-box"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat();
          }}
        >
          {/* <div className="emoji">
            <FontAwesomeIcon
              className="icons"
              icon={faFaceSmile}
              onClick={() => setShowEmoji(!showEmoji)}
            />
            <div className="emoji-picker">
              {showExmoji && <Picker onEmojiClick={setEmoji} />}
            </div>
          </div>
          <div className="attechment" {...getRootProps()}>
            <input {...getInputProps()} />
            <FontAwesomeIcon icon={faPaperclip} className="icons" />
          </div> */}

          <input
            className="input w-100"
            type="text"
            value={msg}
            placeholder="Type a message"
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
          <div className="send-icons-all">
            <div className="emoji">
              <img src={Emoji} alt="Emoji"
                onClick={() => setShowEmoji(!showEmoji)}
              />
              <div className="emoji-picker">
                {showEmoji && <Picker onEmojiClick={setEmoji} />}
              </div>
            </div>
            <div className="attechment" {...getRootProps()}>
              <input {...getInputProps()} />
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 448 512">
                <path fill="#ff6c37" d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
              </svg>
            </div>
            {/* <div className="attechment" {...getRootProps()}>
              <input {...getInputProps()} />
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 448 512"><path fill="#ff6c37" d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" /></svg>
            </div> */}
            {(msg !== "" || selected) && (
              <button id="sub" className="send-button p-0 border-0 bg-transparent" type="submit">
                <img src={Send} alt="Send" />
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default ChatInput;

