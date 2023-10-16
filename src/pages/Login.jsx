import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/feature/authSlice";
import { useEffect } from "react";
import { errorToast } from "../Components/Toast";
import '../assets/CSS/loginBdD.css'
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import logo from "../../public/Plutus_logo.svg";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, errorMsg } = useSelector((state) => state.auth);
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: () => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (errorMsg !== null) {
      errorToast(errorMsg);
    }
  }, [errorMsg]);

  if (isLoggin) {
    navigate("/chat");
  }
  return (
    <div className="login-wrapper d-flex align-items-center position-relative">
      <div class="login-bg"></div>
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
                </div>
                <div className="form-group mb-4">
                  <div className="input">
                    <input
                      placeholder="Enter password"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                    />
                  </div>
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