import "react-toastify/dist/ReactToastify.css";
import { errorToast } from "../Components/Toast";
import { Button, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Carousel from 'react-bootstrap/Carousel';
import '../assets/CSS/Home.css'
import CompanySite from "../../public/Company_Info.png"

function Home() {
  const notify = () => errorToast("errrrooo");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/client')
  };
  return (
    <>

      <div className="welcome-chat">
        <div className="d-lg-none w-100 sticky-top">
          <NavigationBar />
        </div>
        <Row className="m-0 w-100">
          <Col lg={7} className="p-0 d-none d-lg-block">
            <div className="information-detail">
              <img src={CompanySite} className="mb-4 mx-auto img-fluid" alt="Slide" />
              <Carousel fade>
                <Carousel.Item>
                  <h1 className="slider-title mb-3 text-center">We are</h1>
                  <div className="slider-text text-center">Web & mobile app development company</div>
                </Carousel.Item>
                <Carousel.Item>
                  <h1 className="slider-title mb-3 text-center">We've helped</h1>
                  <div className="slider-text text-center">Businesses increase their revenue on an average by 190%</div>
                </Carousel.Item>
                <Carousel.Item>
                  <h1 className="slider-title mb-3 text-center">We provide</h1>
                  <div className="slider-text text-center">CMS & E-commerce ● Mobile applications ● Web application <br />● SEO & Digital marketing ● Responsive design</div>
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
          <Col lg={5} className="p-0">
            <div className="chat-button">
              <div className="d-none d-lg-block w-100">
                <NavigationBar />
              </div>
              <div className="login-section">
                <h4 className="big-title mb-5 text-center">Welcome!<br />Let's get started!</h4>
                <div className="btn-sale">
                  <Button to="/client" onClick={handleClick} className="login-btn">
                    Talk with sales
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
