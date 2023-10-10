
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const errorToast=((msg)=>{
    toast.error(msg, {
        position: toast.POSITION.TOP_CENTER
    });
})
export const successToast=((msg)=>{
    toast.success(msg, {
        position: toast.POSITION.TOP_CENTER
    });
  
})