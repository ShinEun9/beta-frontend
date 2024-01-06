import { ShowResponseType } from "@/types";
import axios from "axios";

const getShowInfo = async (showId: string) => {
  // TODO: try catch
  const { data } = await axios.get<ShowResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/detail/${showId}`);
  return data.data[0];
};

export default getShowInfo;
