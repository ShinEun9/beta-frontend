import axios from "axios";
import { ReviewDeleteParamType } from "@/types";

interface ReviewDeleteResponse {
  ok: boolean;
  data: boolean;
}

const deleteReviewAdmin = async (review: ReviewDeleteParamType) => {
  const { review_id, show_id } = review;
  await axios.delete<ReviewDeleteResponse>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/review/admin/delete/${review_id}/${show_id}`);
};

export default deleteReviewAdmin;
