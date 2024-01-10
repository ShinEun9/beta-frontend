import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Banner, ButtonGroup, SubMenuSection } from "@/components/detail";
import DetailPageSkeleton from "./DetailPageSkeleton";
import { ShowReservationInfoType, ShowType } from "@/types";
import { getShow, getShowReservationInfo } from "@/apis";

const submenuList = [
  { pathname: "", text: "정보" },
  { pathname: "review", text: "후기/방명록" },
];

const DetailPage = () => {
  const { id: showId } = useParams();

  const {
    data: infoData,
    status,
    error,
  } = useQuery<ShowType>({
    queryKey: ["infoData", showId],
    queryFn: () => getShow(showId!),
  });

  useQuery<ShowReservationInfoType>({
    queryKey: ["reservationData", showId],
    queryFn: () => getShowReservationInfo(showId!),
    enabled: !!infoData?.is_reservation,
  });

  if (status === "pending") return <DetailPageSkeleton />;
  if (status === "error") return <h1>{error.message}</h1>;

  return (
    <main>
      <Banner />
      <ButtonGroup />
      <SubMenuSection submenuList={submenuList} baseUrl={`/detail/${showId}`} />
    </main>
  );
};

export default DetailPage;
