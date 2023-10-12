import { useFormik } from "formik";
import { postdata } from "../Utils/http.class";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../Components/Toast";
import "../../src/assets/CSS/register.css";
import { Link } from "react-router-dom";
import screen from "../../public/screen.jpg";
import { Container, Row, Col, Button } from "react-bootstrap";
import login from "../../public/login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";


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
    <div className="Welcome">
      <Row className="border" style={{ borderRadius: "8px",boxShadow: 'rgb(191 190 190 / 57%) 0px 0px 2px 2px',width: "100%",height:"100%"}}>
        {/* <Col md={6}>
          <img src={login} className="w-100" />
        </Col> */}
        <Col md={8} className="register-right-images">
        {/* <div className="title-register">
          <h3>Welcome To Plutus</h3>
          </div> */}
        </Col>
        <Col md={4} >
          <div className="register-form ">
            <h1 className="Title">Register</h1>
            <form onSubmit={handleSubmit} style={{width:'100%'}}>
              <div className="input-container">
                <div className="input">
                  {" "}
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                    placeholder="enter username "
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    placeholder="enter email"
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type="password"
                    name="password"
                    placeholder="enter password"
                    onChange={handleChange}
                    value={values.password}
                  />
                </div>
              </div>
              <div className="input-submit">
                <Button className="submit-button" type="Submit">Register</Button>
              </div>
            </form>
            <div>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Register;