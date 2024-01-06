import axios from "axios";
import { ReviewsGetResponse } from "@/types";

const getUserReviewList = async () => {
  const { data } = await axios.get<ReviewsGetResponse>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/user/review`);
  return data.data;
};

export default getUserReviewList;
