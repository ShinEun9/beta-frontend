import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useColor } from "color-thief-react";
import { toast } from "react-toastify";
import {
  CATEGORY_LIST,
  CONCERT_CATEGORY_LIST,
  IS_RESERVATION_LIST,
  METHOD_LIST,
  appendResultToFormData,
  base64ToBytes,
  convertFormatForFormData,
  convertUrlToFile,
  getResizedImgFiles,
  reduceImageSize,
  validateShowForm,
} from "@/utils";
import { DateWithTimeObj, ShowFormType, ShowResFormType, ShowReservationInfoType, ShowType } from "@/types";
import { useDeleteShowQuery, useEditShowQuery, useGetShowInfoQuery, useGetShowResInfoQuery } from "@/hooks";
import { Button } from "@/components/common";
import { ImageInputSection, ShowInfoInputsSection, ShowResInfoInputsSection } from "@/components/mypage";
import styles from "./PostUpdatePage.module.css";

const PostUpdatePage = () => {
  const locationObj = useLocation();
  const showId = locationObj.state;
  const [isLoading, setIsLoading] = useState(true);

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
  const [imgExistingUrls, setImgExistingUrls] = useState<string[]>([]);
  const [originMainUrl, setOriginMainUrl] = useState<string>("");
  const { data: main_image_color } = useColor(
    imgExistingUrls[0] ? `${import.meta.env.VITE_APP_IMAGE_DOMAIN + imgExistingUrls[0]}` : imgPreviewUrls[0],
    "hex",
    {
      crossOrigin: "anonymous",
    },
  );

  // 게시글 예매 정보
  const [roundList, setRoundList] = useState<DateWithTimeObj[]>([]);

  // 기존 게시글 GET
  const { showInfoData, showInfoStatus, showInfoError } = useGetShowInfoQuery(showId);
  // 기존 게시글 예매 정보 GET
  const { showResInfoData, showResInfoStatus, showResInfoError } = useGetShowResInfoQuery(showId);
  // 게시글 수정 PUT
  const { mutateEditShow } = useEditShowQuery();
  // 게시글 삭제 DELETE
  const { mutateDeleteShow } = useDeleteShowQuery();

  useEffect(() => {
    if (showInfoStatus === "success" && showInfoData) {
      const keysOfShowInfo: Array<keyof ShowType> = [
        "show_type",
        "show_sub_type",
        "title",
        "start_date",
        "end_date",
        "location",
        "location_detail",
        // "position",
        "univ",
        "department",
        "tags",
        "content",
        "is_reservation",
      ];

      keysOfShowInfo.forEach((key) => {
        if (key === "start_date" || key === "end_date") {
          method.setValue(key as string, new Date(showInfoData[key]));
        } else if (key === "tags") {
          showInfoData.tags?.length && method.setValue("tags", Object.values(JSON.parse(showInfoData.tags)) as string[]);
        } else if (key === "content") {
          showInfoData.content && method.setValue("content", new TextDecoder().decode(base64ToBytes(showInfoData.content)));
        } else if (key === "is_reservation") {
          method.setValue("is_reservation", showInfoData.is_reservation === 0 ? "아니오" : "예");
        } else {
          method.setValue(key as string, showInfoData[key]!);
        }
      });

      setPosition(JSON.parse(showInfoData.position));

      setOriginMainUrl(showInfoData.main_image_url);
      setImgExistingUrls(
        showInfoData.sub_images_url
          ? [showInfoData.main_image_url, ...(Object.values(JSON.parse(showInfoData.sub_images_url)) as string[])]
          : [showInfoData.main_image_url],
      );

      if (showInfoData.is_reservation === 0) setIsLoading(() => false);
    }
  }, [showInfoData]);

  useEffect(() => {
    if (showResInfoStatus === "success" && showResInfoData) {
      const keysOfShowResInfo: Array<keyof ShowReservationInfoType> = ["method", "google_form_url", "price", "head_count", "notice"];

      keysOfShowResInfo.forEach((key) => {
        if (key === "method") method.setValue("method", showResInfoData.method === "google" ? "구글폼" : "예매 대행");
        else if (key === "notice")
          showResInfoData.notice && method.setValue("notice", new TextDecoder().decode(base64ToBytes(showResInfoData.notice)));
        else method.setValue(key as string, showResInfoData[key]);
      });

      setRoundList(
        showResInfoData.date_time.map((round) => {
          const [date, time] = round.date_time.split(" - ");
          return { id: round.id.toString(), date, time };
        }),
      );
      setIsLoading(() => false);
    }
  }, [showResInfoData]);

  if (showInfoStatus === "error") return <h1>{showInfoError?.message}</h1>;
  if (showInfoStatus === "pending") return <h1>loading...</h1>;

  if (showResInfoStatus === "error") return <h1>{showResInfoError?.message}</h1>;
  if (showInfoData?.is_reservation && showResInfoStatus === "pending") return <h1>loading reservationInfo...</h1>;

  if (isLoading) return <h1>loading update data ...</h1>;

  // 수정하기 버튼
  const handleOnSubmit = async (data: ShowFormType & ShowResFormType) => {
    const imgCnt = imgFiles.length + imgExistingUrls.length;

    const checkValid = validateShowForm(imgCnt, data, roundList.length);

    if (!checkValid.isValid) {
      toast.error(checkValid.message);
      return;
    }

    const result = convertFormatForFormData(data, main_image_color!, position, roundList);

    const formData = new FormData();
    formData.append("show_id", showId);

    // 1. 텍스트 formData
    appendResultToFormData(result, formData);

    // 2. 이미지 formData
    const resizedImgFiles = await getResizedImgFiles(imgFiles);

    // 서버에 새로 업로드할 이미지들 고르기
    let finalSubImageFiles;
    // 기존 이미지가 남아있으면
    if (imgExistingUrls.length) {
      finalSubImageFiles = resizedImgFiles;
      // 기존 메인 이미지가 변경되면 (그대로면 보내지 않음)
      if (imgExistingUrls[0] !== originMainUrl) {
        // imgExistingUrls[0]을 file로 변환하고 jpeg 리사이즈해서 보내기
        const mainImageFile = await convertUrlToFile(import.meta.env.VITE_APP_IMAGE_DOMAIN + imgExistingUrls[0]);
        const blobString = URL.createObjectURL(mainImageFile);
        const jpeg = await reduceImageSize(blobString);
        const finalMainImageFile = new File([jpeg], imgExistingUrls[0], { type: "image/jpeg" });
        formData.append("mainImage", finalMainImageFile); // 메인 이미지
      }
    } // 기존 이미지가 다 삭제되면
    else {
      formData.append("mainImage", resizedImgFiles[0]); // 메인 이미지
      finalSubImageFiles = resizedImgFiles.slice(1);
    }

    for (let i = 0; i < finalSubImageFiles.length; i++) {
      formData.append("subImages", finalSubImageFiles[i]); // 서브 이미지
    }

    // 이미지 순서와 저장된 기존 서브 이미지 name를 파악하기 위한 file name list 만들기
    const fileNames: { [key: number]: string } = {};
    let finalSubImageUrls;
    if (imgExistingUrls.length > 1) {
      const existingFileNames = imgExistingUrls.slice(1).map((url) => url.split("/show/")[1]);
      const newFileNames = finalSubImageFiles.map((file) => file.name);
      finalSubImageUrls = [...existingFileNames, ...newFileNames];
    } else {
      finalSubImageUrls = finalSubImageFiles.map((file) => file.name);
    }
    finalSubImageUrls.forEach((fileName, index) => (fileNames[index + 1] = fileName));
    formData.append("sub_images_url", JSON.stringify(fileNames));

    mutateEditShow(formData);
  };

  // 삭제하기 버튼
  const handleDeleteShow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirm("정말 삭제하시겠습니까?")) {
      mutateDeleteShow(showId);
      return;
    }
  };

  const watchIsRes = method.watch("is_reservation");

  return (
    <FormProvider {...method}>
      <form className={styles["post-section-form"]}>
        <ImageInputSection
          setImgFiles={setImgFiles}
          imgFiles={imgFiles}
          imgPreviewUrls={imgPreviewUrls}
          setImgPreviewUrls={setImgPreviewUrls}
          imgExistingUrls={imgExistingUrls}
          setImgExistingUrls={setImgExistingUrls}
        />
        <ShowInfoInputsSection setPosition={setPosition} />
        {watchIsRes === "예" && <ShowResInfoInputsSection roundList={roundList} setRoundList={setRoundList} />}

        <div className={styles["button-group"]}>
          <Button type="submit" onClick={handleDeleteShow} reverseColor>
            삭제하기
          </Button>
          <Button type="submit" onClick={method.handleSubmit(handleOnSubmit)}>
            수정하기
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PostUpdatePage;
