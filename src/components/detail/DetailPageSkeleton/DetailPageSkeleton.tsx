import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import bannerStyles from "@/components/detail/Banner/Banner.module.css";
import buttonGroupStyles from "@/components/detail/ButtonGroup/ButtonGroup.module.css";
import { InfoSectionSkeleton, ReviewSectionSkeleton } from "..";
import { Carousel } from "@/components/common";

export const BannerSkeleton = () => {
  return (
    <Carousel index={0}>
      {[1, 2].map((index) => (
        <div key={index}>
          <Skeleton className={bannerStyles["slider__img"]} />
        </div>
      ))}
    </Carousel>
  );
};

export const ButtonGroupSkeleton = () => {
  return (
    <div className={buttonGroupStyles["btn-group"]}>
      <div style={{ width: "100px" }}>
        <Skeleton height={40} />
      </div>
      <div style={{ width: "100px" }}>
        <Skeleton height={40} />
      </div>
    </div>
  );
};

const SubMenuBarSkeleton = () => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
      <div style={{ width: "49%" }}>
        <Skeleton height={50} />
      </div>
      <div style={{ width: "49%" }}>
        <Skeleton height={50} />
      </div>
    </div>
  );
};

export const DetailPageSkeleton = () => {
  const location = useLocation();

  return (
    <main>
      <BannerSkeleton />
      <ButtonGroupSkeleton />
      <SubMenuBarSkeleton />
      {location.pathname.endsWith("review") ? <ReviewSectionSkeleton /> : <InfoSectionSkeleton />}
    </main>
  );
};
