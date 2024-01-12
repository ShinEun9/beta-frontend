import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useColor } from "color-thief-react";
import { toast } from "react-toastify";
import { convertBytesToBase64, convertUrlToFile, getResizedImgFiles, convertArrayToObject, reduceImageSize, formatDate } from "@/utils";
import { DateWithTimeObj, ShowFormResultType, ShowFormType, ShowResFormType } from "@/types";
// import useInputs from "@/hooks/useInputs";
import { deleteAdminShow, getShow, getShowReservationInfo, putShow, postShow } from "@/apis";
import { Button, DeleteButton, Editor, InputFieldRHF, DatePickerRHF, RadioButtonGroupRHF, TagInputRHF } from "@/components/common";
import { Postcode, ReservationForm } from "@/components/mypage";
import ImgUploadIcon from "@/assets/ImgUploadIcon.svg?react";
import styles from "./PostCRUDPage.module.css";
import classNames from "classnames/bind";
import { DevTool } from "@hookform/devtools";

const cx = classNames.bind(styles);

const categoryList = ["공연", "전시"]; // "스포츠"
const concertCategoryList = ["음악", "연극", "기타"];
// const sportsCategoryList = ["야구", "축구", "농구"];
const isReservationList = ["예", "아니오"];
const methodList = ["구글폼", "예매 대행"];

const roundListArrToObj = (roundList: DateWithTimeObj[]) => {
  const obj: { [key: string]: string } = {};
  roundList.forEach((item) => {
    obj[item.id] = item.date + " - " + item.time;
  });
  return obj;
};

const PostCRUDPage = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const showId = locationObj.state || undefined;
  // const [isLoading, setIsLoading] = useState(true);

  const method = useForm({
    defaultValues: {
      show_type: categoryList[0],
      show_sub_type: concertCategoryList[0],
      title: "",
      univ: "",
      department: "",
      start_date: null,
      end_date: null,
      location: "",
      location_detail: null,
      tags: [],
      content: "",
      is_reservation: isReservationList[0],
      method: methodList[0],
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

  useEffect(() => {
    return () => {
      if (imgPreviewUrls) {
        imgPreviewUrls.forEach((objUrl) => URL.revokeObjectURL(objUrl));
      }
    };
  }, [imgPreviewUrls]);

  // 게시글 업로드 POST
  const { mutate } = useMutation({
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

  // 기존 게시글 GET
  const {
    data: showInfoData,
    status: showInfoStatus,
    error,
  } = useQuery({
    queryKey: ["showInfoData", showId],
    queryFn: () => getShow(showId),
    enabled: !!showId,
  });

  // 기존 게시글 예매 정보 GET
  const {
    data: showReservationInfoData,
    status: showReservationInfoStatus,
    error: showReservationInfoError,
  } = useQuery({
    queryKey: ["showReservationInfoData", showId],
    queryFn: () => getShowReservationInfo(showId),
    enabled: !!showInfoData?.is_reservation,
  });

  // 게시글 수정 PUT
  const { mutate: editMutate } = useMutation({
    mutationFn: (formData: FormData) => putShow(formData),
    onSuccess: (data) => {
      if (data) {
        toast.success("게시글 수정 완료");
        navigate("/mypage/admin/post");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // 게시글 삭제 DELETE
  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => deleteAdminShow(showId),
    onSuccess: (data) => {
      if (data) {
        toast.success("게시글 삭제 완료");
        navigate("/mypage/admin/post");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // useEffect(() => {
  //   if (showInfoStatus === "success" && showInfoData) {
  //     // const update = {
  //     //   title: showInfoData.title,
  //     //   show_type: showInfoData.show_type,
  //     //   show_sub_type: showInfoData.show_sub_type,
  //     //   univ: showInfoData.univ,
  //     //   department: showInfoData.department,
  //     //   location_detail: showInfoData.location_detail,
  //     //   is_reservation: showInfoData.is_reservation === 1 ? "예" : "아니오",
  //     // };
  //     // setInitialFormValues(() => update);

  //     // setLocation(showInfoData.location);

  //     const keysOfShowInfo = [
  //       "show_type",
  //       "show_sub_type",
  //       "title",
  //       // "start_date",
  //       // "end_date",
  //       "location",
  //       "location_detail",
  //       // "position",
  //       "univ",
  //       "department",
  //       // "tags",
  //       // "content",
  //       // "is_reservation",
  //     ];

  //     keysOfShowInfo.forEach((key) => method.setValue(key, showInfoData[key]));

  //     method.setValue("position", JSON.parse(showInfoData.position));
  //     method.setValue("date", { start_date: showInfoData.start_date, end_date: showInfoData.end_date });
  //     showInfoData.tags?.length && setTagInputs(Object.values(JSON.parse(showInfoData.tags)) as string[]);
  //     showInfoData.content && method.setValue("content", new TextDecoder().decode(base64ToBytes(showInfoData.content)));

  //     setOriginMainUrl(showInfoData.main_image_url);
  //     setImgExistingUrls(
  //       showInfoData.sub_images_url
  //         ? [showInfoData.main_image_url, ...(Object.values(JSON.parse(showInfoData.sub_images_url)) as string[])]
  //         : [showInfoData.main_image_url],
  //     );
  //   }
  // }, [showInfoData]);

  // useEffect(() => {
  //   if (showInfoData) {
  //     resetForm();
  //     if (!showInfoData.is_reservation) {
  //       setIsLoading(() => false);
  //     }
  //   }
  // }, [initialFormValues, resetForm]);

  // useEffect(() => {
  //   if (showReservationInfoStatus === "success" && showReservationInfoData) {
  //     // const update = {
  //     //   method: showReservationInfoData.method === "google" ? "구글폼" : "예매 대행",
  //     //   google_form_url: showReservationInfoData.google_form_url,
  //     //   price: showReservationInfoData.price,
  //     //   head_count: showReservationInfoData.head_count,
  //     // };
  //     // setInitialResFormValues(() => update);

  //     const keysOfShowResInfo = ["google_form_url", "price", "head_count"];

  //     keysOfShowResInfo.forEach((key) => {
  //       method.setValue(key, showReservationInfoData[key]);
  //     });

  //     method.setValue("method", showReservationInfoData.method === "google" ? "구글폼" : "예매 대행");
  //     setRoundList(
  //       showReservationInfoData.date_time.map((round) => {
  //         const [date, time] = round.date_time.split(" - ");
  //         return { id: round.id.toString(), date, time };
  //       }),
  //     );
  //     showReservationInfoData.notice && method.setValue("notice", new TextDecoder().decode(base64ToBytes(showReservationInfoData.notice)));
  //   }
  // }, [showReservationInfoData]);

  // useEffect(() => {
  //   if (showReservationInfoData) {
  //     resetResForm();
  //     setIsLoading(() => false);
  //   }
  // }, [initialResFormValues, resetResForm]);

  if (showId) {
    if (showInfoStatus === "error") return <h1>{error.message}</h1>;
    if (showInfoStatus === "pending") return <h1>loading...</h1>;

    if (showReservationInfoStatus === "error") return <h1>{showReservationInfoError.message}</h1>;
    if (showInfoData.is_reservation && showReservationInfoStatus === "pending") return <h1>loading reservationInfo...</h1>;

    // if (isLoading) return <h1>loading state update ...</h1>;
  }

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImgFiles([...imgFiles, ...e.target.files]);
    const previewImgSrc = [...e.target.files].map((file) => URL.createObjectURL(file));
    setImgPreviewUrls([...imgPreviewUrls, ...previewImgSrc]);
  };

  // 새로 입력된 이미지들 삭제
  const handleRemoveImage = (image: string) => {
    const deleteImgIndex = imgPreviewUrls.indexOf(image);
    // file 객체 리스트에서 제거
    const newImgFiles = [...imgFiles.slice(0, deleteImgIndex), ...imgFiles.slice(deleteImgIndex + 1)];
    setImgFiles(newImgFiles);
    // 미리보기 blob url 리스트에서 제거
    setImgPreviewUrls((prev) => prev.filter((previewUrl) => previewUrl !== image));
  };
  // 기존 이미지들 삭제
  const handleRemoveExistingImage = (image: string) => {
    setImgExistingUrls((prev) => prev.filter((existingUrl) => existingUrl !== image));
  };

  // 업로드하기, 수정하기 버튼
  const handleOnSubmit = async (data: ShowFormType & ShowResFormType, submitFor: "upload" | "update") => {
    console.log(data);

    // const imgCnt = imgFiles.length + imgExistingUrls.length;

    // if (imgCnt < 2) {
    //   toast.error("이미지를 2개 이상 업로드 해주세요.");
    //   return;
    // }
    // if (imgCnt > 10) {
    //   toast.error("이미지를 10개 이하로 업로드 해주세요.");
    //   return;
    // }
    // if (!data.title || !data.univ || !data.department) {
    //   toast.error("주최자 정보를 입력해주세요.");
    //   return;
    // }
    // if (!data.start_date || !data.end_date) {
    //   toast.error("기간을 입력해주세요.");
    //   return;
    // }
    // if (!location) {
    //   toast.error("주소를 입력해주세요.");
    //   return;
    // }
    // if (!data.tags.length) {
    //   toast.error("tag를 입력해주세요.");
    //   return;
    // }
    // if (data.is_reservation === "예") {
    //   if (data.method === "구글폼" && !data.google_form_url) {
    //     toast.error("구글폼 URL을 입력해주세요.");
    //     return;
    //   }
    //   if (data.method === "예매 대행" && (data.price === null || !data.head_count || !roundList.length || !data.notice)) {
    //     toast.error("예매 작성 폼을 완성해주세요.");
    //     return;
    //   }
    // }

    const base64EncodedContents =
      (!!method.getValues("content") && convertBytesToBase64(new TextEncoder().encode(method.getValues("content")))) || null;
    const base64EncodedNotice =
      (method.getValues("method") === "예매 대행" &&
        !!method.getValues("notice") &&
        convertBytesToBase64(new TextEncoder().encode(method.getValues("notice")))) ||
      null;

    const result: ShowFormResultType = {
      main_image_color: main_image_color as string,
      ...data,
      show_sub_type: data.show_type === "전시" ? null : data.show_sub_type,
      start_date: formatDate(data.start_date!),
      end_date: formatDate(data.end_date!),
      position: JSON.stringify(position),
      tags: JSON.stringify(convertArrayToObject(data.tags)),
      content: base64EncodedContents,
      is_reservation: data.is_reservation === "예" ? "1" : "0",
      method: data.is_reservation === "예" ? (data.method === "구글폼" ? "google" : "agency") : null,
      google_form_url: (data.method === "구글폼" && data.google_form_url) || null,
      price: (data.method === "예매 대행" && (data.price as number).toString()) || null,
      head_count: (data.method === "예매 대행" && (data.head_count as number).toString()) || null,
      date_time: (data.method === "예매 대행" && JSON.stringify(roundListArrToObj(roundList))) || null,
      notice: base64EncodedNotice,
    };

    const formData = new FormData();

    // 텍스트 formData
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

    // 이미지 formData
    const resizedImgFiles = await getResizedImgFiles(imgFiles);

    switch (submitFor) {
      case "upload": {
        formData.append("mainImage", resizedImgFiles[0]); // 메인 이미지
        const finalSubImages = resizedImgFiles.slice(1);
        for (let i = 0; i < finalSubImages.length; i++) {
          formData.append("subImages", finalSubImages[i]); // 서브 이미지
        }

        const fileNames: { [key: number]: string } = {};
        finalSubImages.forEach((file: File, index: number) => (fileNames[index + 1] = file.name));
        formData.append("sub_images_url", JSON.stringify(fileNames)); // 서브 이미지 순서

        mutate(formData);
        break;
      }
      case "update": {
        showId && formData.append("show_id", showId);

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

        // editMutate(formData);
        break;
      }
    }
  };

  // 삭제하기 버튼
  const handleDeleteShow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutate();
      return;
    }
  };

  const watchShowType = method.watch("show_type");
  const watchIsRes = method.watch("is_reservation");
  const watchMethod = method.watch("method");

  return (
    <FormProvider {...method}>
      <form className={styles["post-section-form"]}>
        <section>
          <div className={styles["update-imgs-wrapper"]}>
            <label className={styles["update-img-input"]}>
              <ImgUploadIcon />
              <input type="file" accept="image/*" multiple onChange={handleChangeImage} />
            </label>
            <ul className={styles["imgs-list"]}>
              {imgExistingUrls.map((image) => (
                <li key={image}>
                  <div className={styles["img-cover"]}>
                    <img src={import.meta.env.VITE_APP_IMAGE_DOMAIN + image} alt="" />
                    <DeleteButton spanHidden="해당 이미지 삭제" onClick={() => handleRemoveExistingImage(image)} forImage />
                  </div>
                </li>
              ))}
              {imgPreviewUrls.map((image) => (
                <li key={image}>
                  <div className={styles["img-cover"]}>
                    <img src={image} alt="" />
                    <DeleteButton spanHidden="해당 이미지 삭제" onClick={() => handleRemoveImage(image)} forImage />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className={styles["title"]}>카테고리</h2>
          <RadioButtonGroupRHF radioList={categoryList} name="show_type" />
          {watchShowType === "공연" && <RadioButtonGroupRHF radioList={concertCategoryList} name="show_sub_type" />}
        </section>

        <section>
          <h2 className={cx("a11y-hidden", "title")}>주최 정보</h2>
          <InputFieldRHF type="text" placeholder="제목을 입력해주세요." style={{ padding: "0 1rem" }} name="title">
            제목
          </InputFieldRHF>
          <InputFieldRHF type="text" placeholder="대학을 입력해주세요." style={{ padding: "0 1rem" }} name="univ">
            대학
          </InputFieldRHF>
          <InputFieldRHF type="text" placeholder="학과 또는 학부를 입력해주세요." style={{ padding: "0 1rem" }} name="department">
            학과
          </InputFieldRHF>
        </section>

        <section>
          <h2 className={styles["title"]}>기간</h2>
          <div className={styles["l_date"]}>
            <DatePickerRHF type="period" />
          </div>
        </section>

        <section>
          <h2 className={styles["title"]}>주소</h2>
          <div className={styles["l_address"]}>
            <InputFieldRHF type="text" placeholder="도로명 주소" labelHidden style={{ padding: "0 1rem" }} readOnly name="location">
              도로명 주소
            </InputFieldRHF>
            <Postcode setPosition={setPosition} />
          </div>
          <InputFieldRHF type="text" placeholder="상세 주소" labelHidden style={{ padding: "0 1rem" }} name="location_detail">
            상세 주소
          </InputFieldRHF>
        </section>

        <section className={styles["tags-section"]}>
          <h2 className={styles["title"]}>태그</h2>
          <TagInputRHF control={method.control} name="tags" rules={{ required: true }} />
        </section>

        <section>
          <h2 className={styles["title"]}>소개</h2>
          <Editor name="content" />
        </section>

        <section>
          <h2 className={styles["title"]}>예매 여부</h2>
          <RadioButtonGroupRHF radioList={isReservationList} name="is_reservation" />
          {watchIsRes === isReservationList[0] && (
            <>
              <h3 className={styles["title"]}>예매 방법</h3>
              <RadioButtonGroupRHF radioList={methodList} name="method" />
              {watchMethod === methodList[0] && (
                <InputFieldRHF
                  type="url"
                  placeholder="구글폼 URL을 입력해주세요."
                  labelHidden
                  name="google_form_url"
                  // pattern="https://.*"
                >
                  구글폼url
                </InputFieldRHF>
              )}
              {watchMethod === methodList[1] && <ReservationForm roundList={roundList} setRoundList={setRoundList} />}
            </>
          )}
        </section>

        {showId ? (
          <div className={styles["button-group"]}>
            <Button type="submit" onClick={handleDeleteShow} reverseColor>
              삭제하기
            </Button>
            <Button type="submit" onClick={method.handleSubmit((data) => handleOnSubmit(data, "update"))}>
              수정하기
            </Button>
          </div>
        ) : (
          <Button type="submit" onClick={method.handleSubmit((data) => handleOnSubmit(data, "upload"))}>
            업로드하기
          </Button>
        )}
      </form>
      <DevTool control={method.control} />
    </FormProvider>
  );
};

export default PostCRUDPage;
