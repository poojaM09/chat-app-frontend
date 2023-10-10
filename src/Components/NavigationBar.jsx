import { Container, Navbar, Stack, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/feature/authSlice";
import { logoutClient } from "../redux/feature/clientSlice";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import logo from "../../public/logo.png";
import noDP from "../../public/noDP.jpg";
import "../../src/assets/CSS/navigationbar.css";
import { useEffect } from "react";

function NavigationBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, user } = useSelector((state) => state.auth);
  
  console.log(user, 'user2222')
  const logout = () => {
    socket.emit("end-connection");
    dispatch(logoutUser());
    navigate("/login");
  };
  if (location.pathname === "/") {
    return null;
  }
useEffect(()=>{
})


  const logoutClients = () => {
    socket.emit("end-connection");
    dispatch(logoutClient());
    navigate("/");
  };
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Navbar className="px-4 w-100 navbar">
      <Container fluid>
        {/* <Link to="/chat"> */}
          {" "}
          {/* <img src={logo} width="100"></img>
           */}
          <p className="header-title">Plutus Chat</p>
        {/* </Link> */}
        {!isLoggin ? (
          <>
            <Nav>
              <Stack direction="horizontal">
                <h4>
                  {location.pathname !== "/login" &&
                    location.pathname !== "/register" ? (
                    <Link to="/login">login</Link>
                  ) : null}
                </h4>
              </Stack>
            </Nav>
          </>
        ) : (

          isLoggin && !user.password ? (

            <Dropdown className="dropdown">
            <Dropdown.Toggle id="dropdown-basic">
              <img
                src={noDP}
                height="30px"
                style={{ borderRadius: "50%" }}
              ></img>{" "}
              {user?.name && user?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>profile</Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  logoutClients();
                }}
              >
                logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          ) : (

            <nav>
              <Dropdown className="dropdown">
                <Dropdown.Toggle id="dropdown-basic">
                  <img
                    src={noDP}
                    height="30px"
                    style={{ borderRadius: "50%" }}
                  ></img>{" "}
                  {user?.name && user?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>profile</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      logout();
                    }}
                  >
                    logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </nav>

          )

        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
