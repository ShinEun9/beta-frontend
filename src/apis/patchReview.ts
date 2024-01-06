import axios from "axios";
import { ReviewPatchParamType } from "@/types";

interface ReviewPatchResponse {
  ok: boolean;
  data: boolean;
}

const patchReview = async (review: ReviewPatchParamType) => {
  await axios.patch<ReviewPatchResponse>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/review-update`, review);
};

export default patchReview;
