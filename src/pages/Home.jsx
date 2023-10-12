import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorToast } from "../Components/Toast";
// import { Button, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import '../assets/CSS/Home.css'

function Home() {
  const notify = () => errorToast("errrrooo");
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="Welcome">
        <Row className="h-100 w-100 align-items-center">
          <Col md={8} className="text-container h-100 p-3 position-relative">
            <div className="text-contain ">
              <h3 className="font-weight-bold">Welcome Plutus</h3>
            <p className="text-black w-100 text-center">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto
              numquam sunt obcaecati officia rem ipsum deleniti eos expedita
              recusandae nisi. Error quis consequuntur ex ut eaque perferendis eum
              nostrum incidunt.
            </p>
            </div>
          </Col>
          <Col md={4} className="text-center ">  
          <div >
         <h3 className="started-title">Get started</h3>
          </div>
            <div className="d-flex justify-content-center" style={{gap:'1rem'}}>
              <div className="me-3 w-100">
                <Button className="w-100 Buttons">Register</Button>
              </div>
              <div className="me-3 w-100">
                <Button className="w-100 btn btn-light btn btn-outline-danger">Login</Button>
              </div>
            </div>
          </Col>
        </Row>
      </div> */}
      <div className="Welcome-chat">
        <div className="section">
          <h1>Plutus</h1>
          <div className="section-head">Building Your Vision, One Pixel At A Time</div>
        </div>
        <div className="chat-button">
          <div className="login-section">
            <h4 className="d-flex justify-content-center font-weight-bold">Get started</h4>
            <div className="both-btn">
              <div>
                <Link to="/register">
                  <button className="login-btn">Register</button>
                </Link>
              </div>
              <div>
                <Link to="/login">
                  <button className="login-btn">Login</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
