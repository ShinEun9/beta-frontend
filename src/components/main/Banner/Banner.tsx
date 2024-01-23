import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@/components/common";
import { getBannerImages } from "@/apis";
import styles from "./Banner.module.css";

const Banner = () => {
  const navigate = useNavigate();
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);
  const { data, status, error } = useSuspenseQuery({
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

  return (
    <section className={styles.section}>
      <h2 className={"a11y-hidden"}>진행중인 공연/전시 배너</h2>

      <>
        {status === "error" && <>{error?.message}</>}
        <Carousel index={3} setIsDragging={setIsCarouselDragging}>
          {data?.map((item) => (
            <div onClick={handleClickBannerImage(item.show_id)} key={item.id}>
              <img src={`${import.meta.env.VITE_APP_IMAGE_DOMAIN}${item.image_url}`} className={styles["banner-image"]} />
            </div>
          ))}
        </Carousel>
      </>
    </section>
  );
};

export default Banner;
