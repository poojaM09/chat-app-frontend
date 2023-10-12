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
    <>
      <Container className="p-4  Welcome">
        <Row className="border" style={{ borderRadius: "8px", boxShadow: 'rgb(191 190 190 / 57%) 0px 0px 2px 2px',width: "100%",height:"100%" }}>
          <Col md={8} className="login-right-image">
          </Col>
          <Col md={4}>
            <div className="register-form ">
              <h1 className="Title">Login</h1>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="input-container">
                  <div className="input">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      placeholder="enter email"
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
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      placeholder="enter password"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                    />
                  </div>
                </div>
                <div className="input-submit">
                  <Button className="submit-button" type="Submit">Login</Button>
                </div>
              </form>
              <div>
                New User? <Link to="/register">Create Account</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;