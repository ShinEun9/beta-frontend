import { ShowReservationInfoResponseType } from "@/types";
import axios from "axios";

const getShowReservationInfo = async (showId: string) => {
  // TODO: try catch
  const { data } = await axios.get<ShowReservationInfoResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/reservation/${showId}`);
  return data.data[0];
};

export default getShowReservationInfo;
