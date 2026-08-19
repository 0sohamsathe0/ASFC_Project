const getLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatAttendanceDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getApiErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

const getOptimizedPlayerPhoto = (url) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace(
    "/upload/",
    "/upload/w_240,h_240,c_fill,g_face,f_auto,q_auto/"
  );
};

export {
  formatAttendanceDate,
  getApiErrorMessage,
  getLocalDateString,
  getOptimizedPlayerPhoto,
};
