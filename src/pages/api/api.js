import axiosInstance from "./axiosInstance";

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("usertoken");
};

export const getMethod = async (url) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const postMethod = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axiosInstance.post(url, JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const putMethod = async (url, payload) => {
  try {
    const response = await axiosInstance.put(url, JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const patchMethod = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axiosInstance.patch(url, JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteMethod = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axiosInstance.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // other headers...
      },
      params: payload,
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const deletWithBodyMethod = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  console.log("token",token)
  try {
    const response = await axiosInstance.delete(url, JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const getMethodWithParams = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // other headers...
      },
      params: payload,
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const postMethodForFile = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axiosInstance.post(url, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const putMethodForFile = async (url, payload) => {
  try {
    const response = await axiosInstance.put(url, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const putMethodWithParams = async (url, payload) => {
  try {
    const fullUrl = `${url}?id=${payload.id}&status=${payload.status}`;

    const response = await axiosInstance.put(fullUrl, null, {
      headers: {
        "Content-Type": "application/json",
        // other headers...
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};
export const patchForFile = async (url, payload) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axiosInstance.patch(url, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const setAxiosWithCredentials = async (withCredentials) => {
  return (axiosInstance.defaults.withCredentials = withCredentials);
};
