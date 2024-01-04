import axios from "axios";
import { ReviewsGetResponse } from "@/types";

const getReviews = async (show_id: string) => {
  const { data } = await axios<ReviewsGetResponse>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/detail/${show_id}/review`);

  return data.data;
};

export default getReviews;
