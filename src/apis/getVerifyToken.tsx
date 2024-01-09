import axios, { AxiosError } from "axios";

export const verifyTokenAPI = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/verifyToken`);
    const { login_id, user_name, user_role } = res.data.data;
    console.log("Access token is valid");
    return { isLogin: true, login_id, user_name, user_role };
  } catch (error) {
    // accessToken이 만료된 경우
    const axiosError = error as AxiosError;
    console.log("Access token is Invalid");

    if (axiosError.response && axiosError.response.status === 401) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/refreshToken`);
        const { login_id, user_name, user_role } = res.data.data;
        console.log("refresh token is valid and new access token is issued");
        return { isLogin: true, login_id, user_name, user_role };
      } catch (refreshError) {
        // refreshToken도 만료된 경우
        console.log("refresh token is Invalid");
        return { isLogin: false, login_id: "", user_name: "", user_role: "" };
      }
    } else {
      // 다른 종류의 오류
      console.log("server error");
      return { isLogin: false, login_id: "", user_name: "", user_role: "" };
    }
  }
};
