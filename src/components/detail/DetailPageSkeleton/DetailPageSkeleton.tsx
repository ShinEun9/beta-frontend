import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Carousel } from "@/components/common";
import styles from "@/pages/Detail/DetaiPage.module.css";
import { InfoSectionSkeleton, ReviewSectionSkeleton } from "..";

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

const DetailPageSkeleton = () => {
  const location = useLocation();

  return (
    <main>
      <Carousel index={0}>
        {[1, 2].map((index) => (
          <div key={index}>
            <Skeleton className={styles["slider__img"]} />
          </div>
        ))}
      </Carousel>
      <div className={styles["btn-group"]}>
        <div style={{ width: "120px" }}>
          <Skeleton height={40} />
        </div>
        <div style={{ width: "120px" }}>
          <Skeleton height={40} />
        </div>
      </div>
      <SubMenuBarSkeleton />
      {location.pathname.endsWith("review") ? <ReviewSectionSkeleton /> : <InfoSectionSkeleton />}
    </main>
  );
};

export default DetailPageSkeleton;
