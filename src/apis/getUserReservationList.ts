import axios from "axios";
import { ResponseUserReservationInfoType } from "@/types/userReservationInfoType";

const getUserReservationList = async () => {
  const { data } = await axios.get<ResponseUserReservationInfoType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/user/reservation`);
  return data.data;
};

export default getUserReservationList;
