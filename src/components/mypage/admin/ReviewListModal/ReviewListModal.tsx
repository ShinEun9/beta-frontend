import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteAdminReview, getReviewList } from "@/apis";
import { ReviewDeleteParamType, ReviewType } from "@/types";
import { DeleteButton, Modal, NullField } from "@/components/common";
import { getElapsedTime } from "@/utils";
import { useModalStore } from "@/stores";
import { showIdContext } from "@/stores/ShowIdContext";
import styles from "./ReviewListModal.module.css";

function ReviewListModal() {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();
  const { showId } = useContext(showIdContext);

  // 후기 리스트를 가져오는 쿼리 (조건부로 호출)
  const {
    status: statusReviewList,
    data: reviewList,
    error: errorReviewList,
  } = useQuery({
    queryKey: ["reviewList", showId],
    queryFn: () => getReviewList(showId as string),
    enabled: !!showId,
  });

  // 후기 삭제를 위한 뮤테이션
  const { mutate: deleteMutate } = useMutation({
    mutationFn: (review: ReviewDeleteParamType) => deleteAdminReview(review),
    onMutate: async (review) => {
      await queryClient.cancelQueries({ queryKey: ["reviewList", showId] });
      const oldData = queryClient.getQueryData<ReviewType[]>(["reviewList", showId])!;
      const newData = oldData.filter((item) => item.id !== review.review_id);
      queryClient.setQueryData(["reviewList", showId], [...newData]);
      return { oldData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["reviewList", showId], [...context!.oldData]);
      toast.error("댓글 삭제 실패");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewList", showId] });
      queryClient.invalidateQueries({ queryKey: ["showList"] });
    },
  });

  const handleClickDelete = (item: ReviewType) => () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { id: review_id, show_id } = item;
      deleteMutate({ review_id, show_id });
    }
  };

  return (
    <Modal title={openModal.type}>
      {statusReviewList === "error" && <h1>{errorReviewList.message}</h1>}
      {statusReviewList !== "success" ? (
        <h1>loading...</h1>
      ) : (
        <>
          <strong className={styles["review-count"]}>총 후기수: {reviewList.length}명</strong>
          {reviewList.length ? (
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
