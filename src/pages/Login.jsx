import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/feature/authSlice";
import { useEffect, useState } from "react";
import { errorToast } from "../Components/Toast";
import { successToast } from "../Components/Toast"
import '../assets/CSS/loginBdD.css'
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import the eye icons
import logo from "../../public/Plutus_logo.svg"

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, errorMsg } = useSelector((state) => state.auth);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { handleSubmit, handleChange, values, errors, touched, setTouched } = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Please enter a valid email address.";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address.";
      }
      if (!values.password) {
        errors.password = "Password does not meet the criteria.";
      } else if (values.password.length < 8) {
        errors.password = "Password should be at least 8 characters long.";
      } else if (!/[a-z]/i.test(values.password)) {
        errors.password = "Password should contain at least one lowercase letter.";
      } else if (!/[A-Z]/i.test(values.password)) {
        errors.password = "Password should contain at least one uppercase letter.";
      }else if (!/\d/i.test(values.password)) {
        errors.password = "Password should contain at least one digit.";
      }else if (!/[!@#$%^&*]/i.test(values.password)) {
        errors.password = "Password should contain at least one special character (!@#$%^&*).";
      }
      return errors;
    },
    onSubmit: () => {
      if (validateEmail(values.email) && validatePassword(values.password)) {
        dispatch(loginUser(values));
      }
    },
  });

  const handleInputBlur = (fieldName) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [fieldName]: true,
    }));
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (isLoggin) {
    successToast("Welcome to Chat!");
    setTimeout(() => {
      window.location.href = '/chat';
    }, 1000)
  }

  useEffect(() => {
    if (errorMsg !== null) {
      errorToast(errorMsg);
    }
  }, [errorMsg]);

  if (isLoggin) {

    setTimeout(() => {
      window.location.href = '/chat';
    }, 1000)
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
              <img src={logo} className="mb-3" width="211" height="79" alt="Plutus Logo" />
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
                      onFocus={() => handleInputBlur("email")}
                      className="Input-Field"
                    />
                  </div>
                  {touched.email && errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                <div className="form-group mb-4">
                  <div className="input">
                    <input
                      placeholder="Enter password"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      onChange={handleChange}
                      onFocus={() => handleInputBlur("password")}
                      value={values.password}
                    />
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  {touched.password && errors.password && <div className="text-danger">{errors.password}</div>}
                </div>
                <Button className="login-btn mb-0" type="submit">Login</Button>
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
