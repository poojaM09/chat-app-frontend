import React from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../../src/assets/CSS/imageModel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { saveAs } from "file-saver";
function ImageModel({ Img, setShowImg, chatGptImg }) {


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
  const ext = Img?.split(".")[1];
  return (
    <>
      <Modal centered show={true}>
        <Modal.Body className="image-model">
          <FontAwesomeIcon
            className="image-icon"
            icon={faCircleXmark}
            onClick={() => setShowImg(false)}
          />
          {chatGptImg == true ? (
            <>
              <img className="image" src={Img} height="auto" width="95%" />
            </>
          ) : ext && ext == "mp4" ? (
            <video width="95%" height="auto" controls="controls">
              <source
                src={`https://chat-app-backend-l2a8.onrender.com/public/${Img}`}
                type="video/mp4"
              />
            </video>
          ) : ext == "pdf" ? (
            <>
              <iframe
                src={`https://chat-app-backend-l2a8.onrender.com/public/${Img}`}
                width="95%"
                height="600px"
              ></iframe>
            </>
          ) : ext == "docx" ? (
            <>
              <>
                <iframe
                  // src={`http://docs.google.com/gview?url=https://chat-app-backend-2qte.onrender.com/public/${Img}&embedded=true`}
                  src={`https://chat-app-backend-l2a8.onrender.com/public/${Img}`}
                  width="95%"
                  height="600px"
                ></iframe>
              </>
            </>
          ) : (
            <img
              className="image"
              src={`https://chat-app-backend-l2a8.onrender.com/public/${Img}`}
              height="auto"
              width="95%"
              alt="Modal;"
            />
          )}

          <FontAwesomeIcon
            onClick={() => {
              handleDownload(Img);
            }}
            icon={faCircleDown}
            className="downloadbtn"
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageModel;
