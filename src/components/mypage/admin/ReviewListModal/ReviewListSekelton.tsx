import Skeleton from "react-loading-skeleton";
import styles from "./ReviewListModal.module.css";

const ReviewListModalSekelton = () => {
  return (
    <>
      <div className={styles["review-count"]}>
        <Skeleton width={200} height={"100%"} />
      </div>
      <ul className={styles["review-list"]}>
        <div className={styles["review"]}>
          <div className={styles["review-contents"]}>
            <Skeleton height={"0.7rem"} width={120} />
            <div style={{ marginTop: "0.625rem" }}>
              <Skeleton height={"0.875rem"} width={"100%"} />
            </div>
            <div style={{ marginLeft: "auto" }} className={styles["review__date"]}>
              <div>
                <Skeleton height={"0.75rem"} width={100} />
              </div>
            </div>
          </div>
          <div style={{ width: "2rem", height: "2rem" }}></div>
        </div>
      </ul>
    </>
  );
};

export default ReviewListModalSekelton;
