import { useImgLazyLoading } from "@/hooks";
import React, { useRef } from "react";
import classNames from "classnames/bind";
import styles from "./BannerImage.module.css";

const cx = classNames.bind(styles);

interface PropsType {
  imgUrl: string;
  page: string;
}

const BannerImage: React.FC<PropsType> = ({ imgUrl, page }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  useImgLazyLoading(imgRef);

  return (
    <img
      ref={imgRef}
      data-src={`${import.meta.env.VITE_APP_IMAGE_DOMAIN}${imgUrl}`}
      className={cx(page === "main" ? "banner-image" : "slider__img")}
    />
  );
};

export default BannerImage;
