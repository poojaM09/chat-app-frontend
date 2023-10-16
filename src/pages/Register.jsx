import { useFormik } from "formik";
import { postdata } from "../Utils/http.class";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../Components/Toast";
import "../../src/assets/CSS/register.css";
import { Link } from "react-router-dom";
import screen from "../../public/screen.jpg";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png"; 
import logo from "../../public/Plutus_logo.svg";


function Register() {
  const navigate = useNavigate();
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
  const register = async () => {
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
      <div class="login-bg"></div>
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
                </div>
                <div className="form-group mb-4">
                  <div className="input">
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      onChange={handleChange}
                      value={values.password}
                    />
                  </div>
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