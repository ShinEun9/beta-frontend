import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useColor } from "color-thief-react";
import { toast } from "react-toastify";
import {
  CATEGORY_LIST,
  CONCERT_CATEGORY_LIST,
  IS_RESERVATION_LIST,
  METHOD_LIST,
  convertFormatForFormData,
  getResizedImgFiles,
  validateShowForm,
} from "@/utils";
import { DateWithTimeObj, ShowFormResultType, ShowFormType, ShowResFormType } from "@/types";
import { useUploadShowQuery } from "@/hooks";
import { Button } from "@/components/common";
import { ImageInputSection, ShowInfoInputsSection, ShowResInfoInputsSection } from "@/components/mypage";
import styles from "../PostUpdate/PostUpdatePage.module.css";

const PostUploadPage = () => {
  const method = useForm<ShowFormType & ShowResFormType>({
    defaultValues: {
      show_type: CATEGORY_LIST[0],
      show_sub_type: CONCERT_CATEGORY_LIST[0],
      title: "",
      univ: "",
      department: "",
      start_date: null,
      end_date: null,
      location: "",
      location_detail: null,
      tags: [],
      content: "",
      is_reservation: IS_RESERVATION_LIST[0],
      method: METHOD_LIST[0],
      google_form_url: null,
      price: null,
      head_count: null,
      date_time: null,
      notice: "",
    },
  });

  // 게시글 정보
  const [position, setPosition] = useState<object>({});

  // 이미지 관련
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgPreviewUrls, setImgPreviewUrls] = useState<string[]>([]);
  const { data: main_image_color } = useColor(imgPreviewUrls[0], "hex", {
    crossOrigin: "anonymous",
  });

  // 게시글 예매 정보
  const [roundList, setRoundList] = useState<DateWithTimeObj[]>([]);

  // 게시글 업로드 POST
  const { mutateUploadShow } = useUploadShowQuery();

  // 업로드하기 버튼
  const handleOnSubmit = async (data: ShowFormType & ShowResFormType) => {
    const checkValid = validateShowForm(imgFiles.length, data, roundList.length);

    if (!checkValid.isValid) {
      toast.error(checkValid.message);
      return;
    }

    const result = convertFormatForFormData(data, main_image_color!, position, roundList);

    const formData = new FormData();

    // 1. 텍스트 formData
    const keysToAppend: Array<keyof ShowFormResultType> = [
      "show_type",
      "show_sub_type",
      "title",
      "start_date",
      "end_date",
      "location",
      "location_detail",
      "position",
      "main_image_color",
      "univ",
      "department",
      "tags",
      "content",
      "is_reservation",
      "method",
      "google_form_url",
      "price",
      "head_count",
      "date_time",
      "notice",
    ];

    for (const key of keysToAppend) {
      if (result[key]) {
        // 특정 키에 해당하는 값이 존재할 때만 append
        formData.append(key.toString(), result[key] as string);
      }
    }

    // 2. 이미지 formData
    const resizedImgFiles = await getResizedImgFiles(imgFiles);

    formData.append("mainImage", resizedImgFiles[0]); // 메인 이미지
    const finalSubImages = resizedImgFiles.slice(1);
    for (let i = 0; i < finalSubImages.length; i++) {
      formData.append("subImages", finalSubImages[i]); // 서브 이미지
    }

    const fileNames: { [key: number]: string } = {};
    finalSubImages.forEach((file: File, index: number) => (fileNames[index + 1] = file.name));
    formData.append("sub_images_url", JSON.stringify(fileNames)); // 서브 이미지 순서

    mutateUploadShow(formData);
  };

  const watchIsRes = method.watch("is_reservation");

  return (
    <FormProvider {...method}>
      <form className={styles["post-section-form"]}>
        <ImageInputSection setImgFiles={setImgFiles} imgFiles={imgFiles} imgPreviewUrls={imgPreviewUrls} setImgPreviewUrls={setImgPreviewUrls} />
        <ShowInfoInputsSection setPosition={setPosition} />
        {watchIsRes === "예" && <ShowResInfoInputsSection roundList={roundList} setRoundList={setRoundList} />}

        <Button type="submit" onClick={method.handleSubmit(handleOnSubmit)}>
          업로드하기
        </Button>
      </form>
    </FormProvider>
  );
};

export default PostUploadPage;
