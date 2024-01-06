import { StoryResponseType } from "@/types";
import axios from "axios";

const getStories = async () => {
  const { data } = await axios<StoryResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/storyAll`);
  return data.data;
};

export default getStories;
