import { getShowReservationInfo } from "@/apis";
import { queryClient } from "@/main";
import { ShowType } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetShowResInfoQuery = (showId: string) => {
  const {
    data: showResInfoData,
    status: showResInfoStatus,
    error: showResInfoError,
  } = useQuery({
    queryKey: ["showReservationInfoData", showId],
    queryFn: () => getShowReservationInfo(showId),
    enabled: !!queryClient.getQueryData<ShowType>(["showInfoData", showId])?.is_reservation,
  });
  return { showResInfoData, showResInfoStatus, showResInfoError };
};

export default useGetShowResInfoQuery;
