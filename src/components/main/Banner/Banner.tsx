import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { BannerImage, Carousel } from "@/components/common";
import { getBannerImages } from "@/apis";
import styles from "./Banner.module.css";

const Banner = () => {
  const navigate = useNavigate();
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);
  const { data, status, error } = useQuery({
    queryKey: ["bannerData"],
    queryFn: async () => await getBannerImages(),
  });

  const handleClickBannerImage = (showId: number) => (e: React.MouseEvent) => {
    if (isCarouselDragging) {
      e.stopPropagation();
      return;
    }
    navigate(`detail/${showId}`);
  };

  if (status === "pending") return <Skeleton className={styles.section} />;
  return (
    !!data?.length && (
      <section className={styles.section}>
        <h2 className={"a11y-hidden"}>진행중인 공연/전시 배너</h2>
        <>
          {status === "error" && <>{error.message}</>}
          <Carousel index={0} setIsDragging={setIsCarouselDragging} dataLength={data?.length}>
            {data?.map((item) => (
              <div onClick={handleClickBannerImage(item.show_id)} key={item.id}>
                <BannerImage imgUrl={item.image_url} page="main" />
                {/* <img src={`${import.meta.env.VITE_APP_IMAGE_DOMAIN}${item.image_url}`} className={styles["banner-image"]} /> */}
              </div>
            ))}
          </Carousel>
        </>
      </section>
    )
  );
};

export default Banner;
