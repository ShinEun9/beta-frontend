import { useContext } from "react";
import { useModalStore } from "@/stores";
import { showIdContext } from "@/stores/ShowIdContext";
import { useGetReviewListQuery, useDeleteReviewQuery } from "@/hooks";
import { DeleteButton, Modal, NullField } from "@/components/common";
import { getElapsedTime } from "@/utils";
import { ReviewType } from "@/types";
import styles from "./ReviewListModal.module.css";

function ReviewListModal() {
  const { openModal } = useModalStore();
  const { showId } = useContext(showIdContext);
  const { reviewList, reviewLisStatus, reviewListError } = useGetReviewListQuery(showId!);
  const { deleteMutate } = useDeleteReviewQuery(showId!);

  const handleClickDelete = (item: ReviewType) => () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { id: review_id, show_id } = item;
      deleteMutate({ review_id, show_id });
    }
  };

  return (
    <Modal title={openModal.type}>
      {reviewLisStatus === "error" && <h1>{reviewListError?.message}</h1>}
      {reviewLisStatus !== "success" ? (
        <h1>loading...</h1>
      ) : (
        <>
          <strong className={styles["review-count"]}>총 후기수: {reviewList?.length || 0}명</strong>
          {reviewList?.length ? (
            <ul className={styles["review-list"]}>
              {reviewList.map((item) => (
                <li className={styles["review"]} key={item.id}>
                  <div className={styles["review-contents"]}>
                    <strong className={styles["review__nickname"]}>{item.login_id.slice(0, 3) + "***"}</strong>
                    <p className={styles["review__content"]}>{item.comment}</p>
                    <span className={styles["review__date"]}>{getElapsedTime(item.created_at)}</span>
                  </div>
                  <DeleteButton spanHidden="해당 댓글 삭제" onClick={handleClickDelete(item)} />
                </li>
              ))}
            </ul>
          ) : (
            <NullField text1="아직 후기/방명록이 없어요!" text2="" />
          )}
        </>
      )}
    </Modal>
  );
}

export default ReviewListModal;
