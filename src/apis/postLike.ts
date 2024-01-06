import axios from "axios";

const postLike = async (show_id: string) => {
  await axios.post(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/like-add`, { show_id });
};

export default postLike;
