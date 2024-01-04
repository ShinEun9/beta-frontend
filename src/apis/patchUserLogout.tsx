import axios from "axios";

interface PropsTpye {
  ok: boolean;
  message: string;
}

export const patchUserLogout = async (): Promise<PropsTpye> => {
  const { data } = await axios.patch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/logout`);
  return data;
};
