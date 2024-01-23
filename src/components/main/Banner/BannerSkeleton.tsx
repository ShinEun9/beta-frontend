import Skeleton from "react-loading-skeleton";
import styles from "./Banner.module.css";

const BannerSkeleton = () => {
  return <Skeleton className={styles.section} />;
};

export default BannerSkeleton;
