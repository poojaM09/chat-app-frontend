import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { loginUser } from "../redux/feature/clientSlice";
import { useEffect, useState } from "react";
import { errorToast } from "../Components/Toast";
import { Link } from "react-router-dom";
// import "../../src/assets/CSS/register.css";
import "../../src/assets/CSS/clientForm.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faMobileAlt, faComment } from "@fortawesome/free-solid-svg-icons";
import { getdata } from "../Utils/http.class";


let userList = [];

function ClientForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggin, errorMsg } = useSelector((state) => state.client);
    const [onlineUser, setOnlineUser] = useState([]);
    const [oUser, setOUser] = useState([]);
    const [contact, setContact] = useState();
    const { values, handleChange, handleSubmit } = useFormik({
        initialValues: {
            name: "",
            email: "",
            contactNumber: "",
        },
        onSubmit: (event) => {
            dispatch(loginUser(values));
        },
    });

    //Is Online

    const getUsers = async () => {
        const res = await getdata("user/getUser");
        const response = await res.json();
        setContact(response.users);
    };
    useEffect(() => {
        getUsers();
    }, []);


    userList = contact?.map((data) => { data });
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
    if (oUser.length > 0) {
        localStorage.setItem('currentChat', JSON.stringify(oUser[0]))
    }
    useEffect(() => {
        if (errorMsg !== null) {
            errorToast(errorMsg);
        }
    }, [errorMsg]);

    if (isLoggin) {
        navigate("/client-chat");
    }
    return (
        <>
            {oUser.length > 0 ?
                <Container className="p-4  Welcome">
                    <Row className="border" style={{borderRadius:"8px", boxShadow:'rgb(191 190 190 / 57%) 0px 0px 2px 2px',width: "100%",height:"100%"}}>

                        <Col md={8} className="register-right-image">
                        </Col>

                        <Col md={4}>

                            <div className="register-form ">
                                <p className="Title"> Please fill out the form.</p>
                                <form onSubmit={handleSubmit} style={{width:'100%'}}>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faUser} />
                                            <input
                                                placeholder="Enter Name"
                                                type="text"
                                                name="name"
                                                onChange={handleChange}
                                                value={values.name}
                                                className="Input-Field"
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <input
                                                placeholder="Enter Email"
                                                type="text"
                                                name="email"
                                                onChange={handleChange}
                                                value={values.email}
                                                className="Input-Field"
                                            />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input">
                                            <FontAwesomeIcon icon={faMobileAlt} />
                                            <input
                                                type="number"
                                                name="contactNumber"
                                                placeholder="Enter Contact Number"
                                                onChange={handleChange}
                                                value={values.contactNumber}
                                                className="Input-Field"
                                            />
                                        </div>
                                    </div>
                                    <div className="input-submit">
                                        <Button className="submit-button" type="Submit">Talk with sales</Button>
                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
                :
                <Container className="p-4  Welcome">
                    <Row className="border" style={{borderRadius:"8px", boxShadow:'rgb(191 190 190 / 57%) 0px 0px 2px 2px',width: "100%",height:"100%"}}>

                        <Col md={8} className="register-right-image">
                            {/* <div className="main-text">
                                <h3 className="text-title">Plutus Technologies</h3>
                                <span className="text">Plutus Technologies has steadfastly upheld its commitment to delivering exceptional services since its establishment in 2014.
                                    We remain committed to being at the forefront as a custom software development company.
                                    Innovative and technologically driven, we are constantly pushing the boundaries of our industry
                                    and setting new standards of excellence.</span>
                            </div> */}
                        </Col>

                        <Col md={4}>

                            <div className="register-form">
                                {/* <h1>Sign In</h1> */}
                                <p className="Title">Currently BDS are not available , please leave the message</p>
                                <form  style={{width:'100%'}}>
                                    <div>
                                        <div className="input-container">
                                            <div className="input">
                                                <FontAwesomeIcon icon={faUser} />
                                                <input
                                                    placeholder="Enter Name"
                                                    type="text"
                                                    name="name"
                                                // onChange={handleChange}
                                                // value={values.name}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-container">
                                            <div className="input">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                <input
                                                    placeholder="Enter Email"
                                                    type="text"
                                                    name="email"
                                                // onChange={handleChange}
                                                // value={values.email}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-container">
                                            <div className="input">
                                                <FontAwesomeIcon icon={faMobileAlt} />
                                                <input
                                                    type="number"
                                                    name="contactNumber"
                                                    placeholder="Enter Contact Number"
                                                // onChange={handleChange}
                                                // value={values.contactNumber}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-container">
                                            <div className="input">
                                                <FontAwesomeIcon icon={faComment} />
                                                <input
                                                    type="text"
                                                    name="message"
                                                    placeholder="Enter Message"
                                                // onChange={handleChange}
                                                // value={values.contactNumber}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-submit">
                                            <Button className="submit-button" type="Submit">Send To Mail</Button>
                                        </div>
                                    </div>
                                    <span > Or click on this Link <a href="https://plutustec.com/contact-us" target="_blank"> <b>Contact-us</b> </a>for fill contact page</span>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
        </>
    );
}

export default ClientForm;
