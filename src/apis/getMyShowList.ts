import { ShowType } from "@/types";
import axios from "axios";

interface ShowListResponse {
  ok: boolean;
  data: ShowListItemType[];
}

interface ShowListItemType extends Omit<ShowType, "user_liked"> {
  likes_count: number;
  reviews_count: number;
}

const getMyShowList = async () => {
  const { data } = await axios<ShowListResponse>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/user`);
  return data.data;
};

export default getMyShowList;
