import axios from "axios";
import { ShowResponseType } from "@/types";

const getUserLikeList = async () => {
  const { data } = await axios.get<ShowResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/user/like`);
  return data.data;
};

export default getUserLikeList;
