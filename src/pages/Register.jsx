import { useFormik } from "formik";
import { postdata } from "../Utils/http.class";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../Components/Toast";
import "../../src/assets/CSS/register.css";
import { Link } from "react-router-dom";
import screen from "../../public/screen.jpg";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; 
import login from "../../public/login.png";
import logo from "../../public/Plutus_logo.svg";
import React, { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: () => {
      register();
    },
  });

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("Password should be at least 8 characters long.");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password should contain at least one lowercase letter.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password should contain at least one uppercase letter.");
      return false;
    }
    if (!/\d/.test(password)) {
      setPasswordError("Password should contain at least one digit.");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError(
        "Password should contain at least one special character (!@#$%^&*)."
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
    if (!/^[A-Za-z]{3}$/.test(name)) {
      setNameError("Name should contain exactly 3 letters.");
      return false;
    }

    setNameError("");
    return true;
  };

  const register = async () => {
    const nameValid = validateName(values.name);
    const passwordValid = validatePassword(values.password);
    const emailValid = validateEmail(values.email);

    if (!nameValid || !passwordValid || !emailValid) {
      return;
    }

    const res = await postdata("user/register", values);
    const response = await res.json();
    if (response.status === 1) {
      navigate("/login");
    } else {
      errorToast(response.message);
    }
  };
  return (
    <div className="login-wrapper d-flex align-items-center position-relative">
      <div className="login-bg"></div>
      <Container className="Welcome">
        <Row className="p-0 m-0 w-100 h-100">
          {/* <Col md={6}>
            <img src={login} className="w-100" />
          </Col> */}
          <Col lg={6} className="register-right-images">
            {/* <div className="title-register">
            <h3>Welcome To Plutus</h3>
            </div> */}
          </Col>
          <Col lg={6} className="px-3 px-lg-0">
            <div className="register-form ">
              <img src={logo} className="mb-3" width="211" height="79" />
              <form onSubmit={handleSubmit} className="my-auto">
                <h1 className="slider-title mb-5 text-center">Register</h1>
                <div className="form-group mb-4">
                  <div className="input">
                    {" "}
                    <input
                      type="text"
                      name="name"
                      onChange={handleChange}
                      value={values.name}
                      placeholder="Enter username "
                    />
                  </div>
                  {nameError && (
                    <div className="text-danger">{nameError}</div>
                  )}
                </div>
                <div className="form-group mb-4">
                  <div className="input">
                    <input
                      type="text"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                      placeholder="Enter email"
                    />
                  </div>
                  {emailError && (
                    <div className="text-danger">{emailError}</div>
                  )}
                </div>
                <div className="form-group mb-4">
                  <div className="input">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      onChange={handleChange}
                      value={values.password}
                    />
                   <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  {passwordError && (
                    <div className="text-danger">{passwordError}</div>
                  )}
                </div>
                <Button className="login-btn mb-0" type="Submit">Register</Button>
              </form>
              <div>
                Already have an account? <Link className="text-orange" to="/login">Login</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;