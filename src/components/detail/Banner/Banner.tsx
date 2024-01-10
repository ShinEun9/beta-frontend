import { useParams } from "react-router-dom";
import { queryClient } from "@/main";
import { Carousel } from "@/components/common";
import { ShowType } from "@/types";
import styles from "./Banner.module.css";

const Banner = () => {
  const { id: showId } = useParams();
  const { main_image_url: mainImg, sub_images_url } = queryClient.getQueryData<ShowType>(["infoData", showId])!;
  const subImgs = sub_images_url ? Object.values(JSON.parse(sub_images_url)) : [];
  const bannerImgs = [mainImg, ...subImgs];

  return (
    <Carousel index={0}>
      {bannerImgs.map((img, index) => (
        <div key={index}>
          <img src={import.meta.env.VITE_APP_IMAGE_DOMAIN + img} className={styles["slider__img"]} />
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
