
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock,faEnvelope,faMobileAlt,faComment } from "@fortawesome/free-solid-svg-icons";
import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

function ContactAS() {
  return (
    <>
    <Container className="p-4  Welcome">
      <Row>
        <Col md={6}>
          {/* <img src={login} className="w-100" /> */}
        </Col>
        <Col md={6}>
          <div className="register-form">
            {/* <h1>Sign In</h1> */}
            <form>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faUser}/>
                  <input
                    placeholder="Enter Name"
                    type="text"
                    name="name"
                    // onChange={handleChange}
                    // value={values.name}
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faEnvelope}/>
                  <input
                    placeholder="Enter Email"
                    type="text"
                    name="email"
                    // onChange={handleChange}
                    // value={values.email}
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faMobileAlt}/>
                  <input
                    type="number"
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    // onChange={handleChange}
                    // value={values.contactNumber}
                  />
                </div>
              </div>
              <div className="input-container">
                <div className="input">
                  <FontAwesomeIcon icon={faComment}/>
                  <input
                    type="text"
                    name="message"
                    placeholder="Enter Message"
                    // onChange={handleChange}
                    // value={values.contactNumber}
                  />
                </div>
              </div>
              <div className="input-submit">
                <Button className="submit-button" type="Submit">Send To Mail</Button>
              </div>
            </form>
            {/* <div>
              New User? <Link to="/register">Create Account</Link>
            </div> */}
          </div>
        </Col>
      </Row>
    </Container>
  </>
  )
}

export default ContactAS