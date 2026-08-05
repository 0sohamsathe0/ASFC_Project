import axios from "axios";
import { checkServer } from "../utils/checkServer";
import { notifyServerDown } from "../utils/serverEvents";
// During development, automatically use the current host
// (localhost on PC, LAN IP on mobile).
// In production, use the configured API URL.
const baseURL = import.meta.env.DEV
  ? `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}`
  : import.meta.env.VITE_API_URL;

  let checkingServer = false;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // If the server responded (400, 401, 404, 500, etc.)
    // this is NOT a server-down situation.
    if (error.response) {
      return Promise.reject(error);
    }

    // Don't trigger while already checking
    if (checkingServer) {
      return Promise.reject(error);
    }

    // Already on maintenance page
    if (window.location.pathname === "/maintenance") {
      return Promise.reject(error);
    }

    checkingServer = true;

    try {
      const live = await checkServer();

      if (!live) {
        notifyServerDown();
      }
    } finally {
      checkingServer = false;
    }

    return Promise.reject(error);
  }
);


export {api , baseURL} ;