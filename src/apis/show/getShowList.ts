import axios from "axios";
import { ShowResponseType } from "@/types";

const getShowList = async (type: string, queryString: string) => {
  const { data } = await axios<ShowResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/${type}?${decodeURI(queryString)}`);
  return data.data;
};

export default getShowList;
