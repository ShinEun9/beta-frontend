import axios from "axios";

interface SignUserInfoResponseType {
  ok: boolean;
  data: string;
}

const getSignUserInfo = async (userId: string) => {
  const { data } = await axios.get<SignUserInfoResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/sign/getMember/${userId}`);
  return data;
};

export default getSignUserInfo;
