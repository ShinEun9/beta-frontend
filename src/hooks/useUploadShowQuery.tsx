import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { postShow } from "@/apis";

const useUploadShowQuery = () => {
  const { mutate: mutateUploadShow } = useMutation({
    mutationFn: (formData: FormData) => postShow(formData),
    onSuccess: (data) => {
      if (data) {
        toast.success("게시글 업로드 성공");
        // navigate("/mypage/admin/post");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return { mutateUploadShow };
};

export default useUploadShowQuery;
