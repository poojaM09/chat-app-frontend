import { io } from "socket.io-client";
export const socket = io("https://chat-app-backend-l2a8.onrender.com", { transports: ['websocket'], upgrade: false });
