import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/feature/authSlice";
import { useEffect } from "react";
import { errorToast } from "../Components/Toast";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png";
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
        <Row>
          <Col md={12}>
            <div className="register-form ">
              <h1>Login</h1>
              <form onSubmit={handleSubmit}>
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