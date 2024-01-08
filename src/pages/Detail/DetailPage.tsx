import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Banner, ButtonGroup, SubMenuSection, DetailPageSkeleton } from "@/components/detail";
import { useShowInfoStore } from "@/stores/useShowInfoStore";
import { getShowInfo } from "@/apis";

const submenuList = [
  { pathname: "", text: "정보" },
  { pathname: "review", text: "후기/방명록" },
];

const DetailPage = () => {
  const { id: showId } = useParams();
  const { setShowInfo } = useShowInfoStore();

  const {
    status,
    data: infoData,
    error,
  } = useQuery({
    queryKey: ["infoData", showId],
    queryFn: () => getShowInfo(showId!),
  });

  useEffect(() => {
    infoData && setShowInfo(infoData);
  }, [infoData]);

  if (status === "pending") return <DetailPageSkeleton />;
  if (status === "error") return <h1>{error.message}</h1>;

  return (
    <>
      <main>
        <Banner />
        <ButtonGroup />
        <SubMenuSection submenuList={submenuList} baseUrl={`/detail/${showId}`} />
      </main>
    </>
  );
};

export default DetailPage;
