export const SERVER_DOWN_EVENT = "server-down";

export const notifyServerDown = () => {
  window.dispatchEvent(new Event(SERVER_DOWN_EVENT));
};