import axios from "axios";
import { MemberResponseType } from "@/types";

const getUserProfile = async (login_id: string) => {
  const { data } = await axios.get<MemberResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/getMember/${login_id}`);
  return data.data[0];
};

export default getUserProfile;
