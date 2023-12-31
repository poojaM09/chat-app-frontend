import { Container, Navbar, Stack, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/feature/authSlice";
import { logoutClient } from "../redux/feature/clientSlice";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import logo from "../../public/Plutus_logo.svg";
import noDP from "../../public/profile-user.png";
import "../../src/assets/CSS/navigationbar.css";
import { useEffect } from "react";
import { successToast } from "./Toast";

function NavigationBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggin, user } = useSelector((state) => state.auth);


  const logout = () => {
    socket.emit("end-connection");
    dispatch(logoutUser());
    window.location.href='/login';
  };
  const logoutClients = () => {
    socket.emit("end-connection");
    dispatch(logoutClient());
    window.location.href='/';
      // navigate("/client-chat");
    // window.location.reload();
  };

  return (
    <Navbar className="p-0 w-100 header  navbar">
      {" "}
      <div className="w-100 px-3 py-2 logo">
        <img src={logo} width="211" height="79" />
      </div>
      {!isLoggin ? (
        <>
          <Nav>
            <Stack direction="horizontal">
              <h4>
                {location.pathname !== "/login" &&
                  location.pathname !== "/register" && location.pathname !== "/" && location.pathname !== "/home" ? (
                  <Link to="/login">login</Link>
                ) : null}
              </h4>
            </Stack>
          </Nav>
        </>
      ) : (
        isLoggin && !user.password ? (
          <Dropdown className="dropdown">
            <Dropdown.Toggle className="d-flex align-items-center" id="dropdown-basic">
              <span className="avatar_circle d-flex align-items-center justify-content-center">{user?.name?.charAt(0) && user?.name?.charAt(0)}</span>
              <span className="d-none d-lg-block">
                {user?.name && user.name.length > 0 ? user.name[0].toUpperCase() + user.name.slice(1) : ""}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  logoutClients();
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <nav>
            <Dropdown className="dropdown">
              <Dropdown.Toggle className="d-flex align-items-center" id="dropdown-basic">
                <span className="avatar_circle d-flex align-items-center justify-content-center">{user?.name?.charAt(0) && user?.name?.charAt(0)}</span>
                <span className="d-none d-lg-block">
                  {user?.name && user.name.length > 0 ? user.name[0].toUpperCase() + user.name.slice(1) : ""}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </nav>
        )
      )}
    </Navbar>
  );
}

export default NavigationBar;
