import axios from "axios";

const deleteLike = async (show_id: string) => {
  await axios.delete(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/like-delete/${show_id}`);
};

export default deleteLike;
