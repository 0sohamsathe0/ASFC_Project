const getAdminToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken="))
    ?.split("=")[1];

export default getAdminToken;