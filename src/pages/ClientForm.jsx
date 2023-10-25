import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { loginUser } from "../redux/feature/clientSlice";
import { useEffect, useState } from "react";
import { errorToast } from "../Components/Toast";
import { successToast } from "../Components/Toast"
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
    const [contactNumberError, setCNumberError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        contactNumber: false,
    });

    const { values, handleChange, handleSubmit, errors } = useFormik({
        initialValues: {
            name: "",
            email: "",
            contactNumber: "",
        },
        onSubmit: () => {
            const isNameValid = validateName(values.name);
            const isEmailValid = validateEmail(values.email);
            const isContactValid = validateContactNumber(values.contactNumber);

            if (isNameValid && isEmailValid && isContactValid) {
                dispatch(loginUser(values));
            }
        },
        validate: (values) => {
            const errors = {};
            if (!validateName(values.name)) {
                errors.name = "Name is required and should be at least 3 characters long.";
            }
            if (!validateEmail(values.email)) {
                errors.email = "Please enter a valid email address.";
            }
            if (!validateContactNumber(values.contactNumber)) {
                errors.contactNumber = "Enter exactly 10 digits.";
            }
            return errors;
        },

    });
    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address.");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    };

    const validateName = (name) => {
        if (name.trim() === "") {
            setNameError("Name cannot be empty.");
            return false;
        }
        if (name.trim().length < 3) {
            setNameError("Name should be at least 3 characters long.");
            return false;
        }
        if (!/^[A-Za-z]+$/.test(name)) {
            setNameError("Name should contain only letters (no numbers or special characters).");
            return false;
        } else {
            setNameError("");
            return true;
        }
    };

    const validateContactNumber = (contactNumber) => {
        const numberPattern = /^[0-9]{10}$/;

        if (!numberPattern.test(contactNumber)) {
            setCNumberError("Enter exactly 10 digits.");
            return false;
        } else {
            setCNumberError("");
            return true;
        }
    };

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

    const handleInputBlur = (fieldName) => {
        setTouched((prevTouched) => ({
            ...prevTouched,
            [fieldName]: true,
        }));
    };


    useEffect(() => {
        if (isLoggin) {
            successToast("Welcome to Chat!");
            setTimeout(() => {
                window.location.href = "/client-chat"
            }, 1000)
        }
    }, [isLoggin]);
    // const userWithNewMessage = contact?.find((user) => {
    //     user?._id === oUser.userID
    // });

    // useEffect(() => {
    //     if (oUser?.length > 0) {
    //         const userWithCondition = userList?.find((user) => {
    //             return oUser.some((online) => online?.userID === user?._id) && !user?.contactNumber;
    //         });

    //

    //         if (userWithCondition) {
    //             // Display the form if a user meets the condition
    //             navigate("/client-form");
    //         }
    //     }
    // }, [oUser, userList, navigate]);

    return (
        <div className="login-wrapper d-flex align-items-center position-relative">
            <div className="login-bg"></div>
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
                                                onFocus={() => handleInputBlur("name")}
                                                value={values.name}
                                                className="Input-Field"
                                            />
                                        </div>
                                        {touched.name && errors.name && <div className="text-danger">{errors.name}</div>}
                                    </div>
                                    <div className="form-group mb-4">
                                        <div className="input">
                                            <input
                                                placeholder="Enter email"
                                                type="text"
                                                name="email"
                                                onChange={handleChange}
                                                onFocus={() => handleInputBlur("email")}
                                                value={values.email}
                                                className="Input-Field"
                                            />
                                        </div>
                                        {touched.email && errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                    <div className="form-group mb-4">
                                        <div className="input">
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                placeholder="Enter contact number"
                                                onChange={handleChange}
                                                onFocus={() => handleInputBlur("contactNumber")}
                                                value={values.contactNumber}
                                                maxLength={10}
                                                className="Input-Field"
                                            />
                                        </div>
                                        {touched.contactNumber && errors.contactNumber && <div className="text-danger">{errors.contactNumber}</div>}
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
                        <Col lg={6} className="register-right-image">
                        </Col>
                        <Col lg={6} className="px-3 px-lg-0">
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
