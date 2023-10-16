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
import logo from "../../public/Plutus_logo.svg";


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
        <div className="login-wrapper d-flex align-items-center position-relative">
            <div class="login-bg"></div>
            {oUser.length > 0 ?
                <Container className="Welcome">
                    <Row className="p-0 m-0 w-100 h-100">
                        <Col lg={6} className="register-right-image">
                        </Col>
                        <Col lg={6} className="px-3 px-lg-0">
                            <div className="register-form ">
                                <img src={logo} className="mb-3" width="211" height="79" />
                                <form onSubmit={handleSubmit} className="my-auto">
                                    <p className="medium-title text-center"> Please fill out the form.</p>
                                    <div className="form-group mb-4">
                                        <div className="input">
                                            <input
                                                placeholder="Enter name"
                                                type="text"
                                                name="name"
                                                onChange={handleChange}
                                                value={values.name}
                                                className="Input-Field"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-4">
                                        <div className="input">
                                            <input
                                                placeholder="Enter email"
                                                type="text"
                                                name="email"
                                                onChange={handleChange}
                                                value={values.email}
                                                className="Input-Field"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-4">
                                        <div className="input">
                                            <input
                                                type="number"
                                                name="contactNumber"
                                                placeholder="Enter contact number"
                                                onChange={handleChange}
                                                value={values.contactNumber}
                                                className="Input-Field"
                                            />
                                        </div>
                                    </div>
                                    <Button className="login-btn mb-0" type="Submit">Talk with sales</Button>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
                :
                <Container className="Welcome">
                    <Row className="p-0 m-0 w-100 h-100">
                        <Col md={6} className="register-right-image">
                            {/* <div className="main-text">
                                <h3 className="text-title">Plutus Technologies</h3>
                                <span className="text">Plutus Technologies has steadfastly upheld its commitment to delivering exceptional services since its establishment in 2014.
                                    We remain committed to being at the forefront as a custom software development company.
                                    Innovative and technologically driven, we are constantly pushing the boundaries of our industry
                                    and setting new standards of excellence.</span>
                            </div> */}
                        </Col>
                        <Col md={6} className="px-3 px-lg-0">
                            <div className="register-form">
                                <img src={logo} className="mb-3" width="211" height="79" />
                                <div className="my-auto">
                                    <p className="medium-title text-center">Currently team is not available, <br />please send the message on this link <a href="https://plutustec.com/contact-us" target="_blank" className="text-orange">www.plutustec.com/contact-us</a> <br />to share your details</p>
                                    <form className="d-none">
                                        <div>
                                            <div className="form-group mb-4">
                                                <div className="input">
                                                    <input
                                                        placeholder="Enter Name"
                                                        type="text"
                                                        name="name"
                                                    // onChange={handleChange}
                                                    // value={values.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group mb-4">
                                                <div className="input">
                                                    <input
                                                        placeholder="Enter Email"
                                                        type="text"
                                                        name="email"
                                                    // onChange={handleChange}
                                                    // value={values.email}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group mb-4">
                                                <div className="input">
                                                    <input
                                                        type="number"
                                                        name="contactNumber"
                                                        placeholder="Enter Contact Number"
                                                    // onChange={handleChange}
                                                    // value={values.contactNumber}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group mb-4">
                                                <div className="input">
                                                    <input
                                                        type="text"
                                                        name="message"
                                                        placeholder="Enter Message"
                                                    // onChange={handleChange}
                                                    // value={values.contactNumber}
                                                    />
                                                </div>
                                            </div>
                                            <Button className="login-btn mb-0" type="Submit">Send To Mail</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    );
}

export default ClientForm;
