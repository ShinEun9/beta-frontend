import axios from "axios";
import { ShowType } from "@/types";

interface ReservationListResponseType {
  ok: boolean;
  data: ShowType[];
}

const getAdminReservationList = async () => {
  const { data } = await axios<ReservationListResponseType>(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/show/admin/reservation/manage`);

  return data.data;
};

export default getAdminReservationList;
