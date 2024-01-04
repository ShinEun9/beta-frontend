import { StoryResponseType } from "@/types";
import axios from "axios";

const getStoryUser = async () => {
  const { data } = await axios.get<StoryResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/story/user`);
  return data.data;
};

export default getStoryUser;
