import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chats from "./pages/Chats";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.css";
import Home from "./pages/Home";
import { ToastContainer, toast } from "react-toastify";
import "./index.css";
import ClientForm from "./pages/ClientForm";
import ClientChatConatainer from "./pages/ClientChatConatainer";
function App() {
  return (
    <BrowserRouter>
      <>
        <div className="app-container">
          <div className="content">
            <ToastContainer />
            <Routes>
              <Route path="/client" element={<ClientForm />} />
              <Route path="/chat" element={<Chats />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home/>} />
              <Route path="/client-chat" element={<ClientChatConatainer/>} />
            </Routes>
          </div>
        </div>
      </>
    </BrowserRouter>
  );
}
export default App;
