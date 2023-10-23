import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/feature/authSlice";
import { useEffect, useState } from "react";
import { errorToast } from "../Components/Toast";
import '../assets/CSS/loginBdD.css'
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import the eye icons
import logo from "../../public/Plutus_logo.svg";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, errorMsg } = useSelector((state) => state.auth);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Track password visibility
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: () => {
      if (validateEmail(values.email) && validatePassword(values.password)) {
        dispatch(loginUser(values));
      } else {
        setEmailError("Please enter a valid email address.");
        setPasswordError("Password does not meet the criteria.");
      }
    },
  });

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    setEmailError("");
    return true;
  };

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
      setPasswordError("Password should contain at least one special character (!@#$%^&*).");
      return false;
    }

    setPasswordError("");
    return true;
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (isLoggin) {
    window.location.href = '/chat';
  }

  useEffect(() => {
    if (errorMsg !== null) {
      errorToast(errorMsg);
    }
  }, [errorMsg]);

  if (isLoggin) {
    // navigate("/chat");
    window.location.href = '/chat';
  }
  return (
    <div className="login-wrapper d-flex align-items-center position-relative">
      <div className="login-bg"></div>
      <Container className="Welcome">
        <Row className="p-0 m-0 w-100 h-100">
          <Col lg={6} className="login-right-image p-0">
          </Col>
          <Col lg={6} className="px-3 px-lg-0">
            <div className="register-form">
              <img src={logo} className="mb-3" width="211" height="79" />
              <form onSubmit={handleSubmit} className="w-100 my-auto">
                <h1 className="slider-title mb-5 text-center">Login</h1>
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
                  {emailError && <div className="text-danger">{emailError}</div>}
                </div>
                <div className="form-group mb-4">
                  <div className="input">
                    <input
                      placeholder="Enter password"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                    />
                <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  {passwordError && <div className="text-danger">{passwordError}</div>}
                </div> 
                <Button className="login-btn mb-0" type="Submit">Login</Button> 
              </form>
              <div className="mt-3">
                New User? <Link to="/register" className="text-orange">Create Account</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
