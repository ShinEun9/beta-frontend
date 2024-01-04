import axios from "axios";

interface PutShowResponse {
  ok: boolean;
  data: string;
}

const putShow = async (formData: FormData) => {
  const { data } = await axios.put<PutShowResponse>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/update`, formData);
  return data.ok;
};

export default putShow;
