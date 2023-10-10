import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorToast } from "../Components/Toast";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const notify = () => errorToast("errrrooo");
  const navigate = useNavigate();

  return (
    <>
      <div className="Welcome">
        <div>
          <h1>Welcome To Chat App</h1>
          <Button onClick={() => navigate("/chat")}>Start Chat</Button>
        </div>
      </div>
    </>
  );
}

export default Home;