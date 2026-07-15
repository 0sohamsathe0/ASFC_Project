import axios from "axios";
// During development, automatically use the current host
// (localhost on PC, LAN IP on mobile).
// In production, use the configured API URL.
const baseURL = import.meta.env.DEV
  ? `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}`
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export {api , baseURL} ;