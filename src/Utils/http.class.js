export const BASE_URL = "https://chat-app-backend-l2a8.onrender.com/api/";


export const postdata = (api, data) => {
  return apicall(api, data, "POST");
};
export const getdata = (api, data) => {
  return apicall(api, data, "GET");
};
export const postimage = (api, data) => {
  return imageapicall(api, data, "POST");
};
const apicall = (api, data, method) => {

  const token = localStorage.getItem("user")
    ? localStorage.getItem("user")
    : null;
  if (method === "GET") {

    return fetch(BASE_URL + api, {
      method: method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    const token = localStorage.getItem("user")
      ? localStorage.getItem("user")
      : null;
    return fetch(BASE_URL + api, {
      method: method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),

    });
  }
};
const imageapicall = (api, data, method) => {
  const token = localStorage.getItem("user")
    ? localStorage.getItem("user")
    : null;
  console.log("imageapicall", api, data, method);
  return fetch(BASE_URL + api, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
};
