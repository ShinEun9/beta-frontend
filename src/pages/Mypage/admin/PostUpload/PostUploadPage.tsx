import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useColor } from "color-thief-react";
import { toast } from "react-toastify";
import postShow from "@/apis/postShow";
import useInputs from "@/hooks/useInputs";
import { bytesToBase64, getResizedImgFiles } from "@/utils";
import { Button, DatePicker, DeleteButton, Editor, InputField, RadioButtonGroup, TagInput } from "@/components/common";
import { Postcode, ReservationForm } from "@/components/mypage";
import { DateInputType, DateWithTimeObj, ShowFormResultType } from "@/types";

import ImgUploadIcon from "@/assets/ImgUploadIcon.svg?react";
import convertArrayToObject from "@/utils/convertArrayToObject";
import styles from "./PostUploadPage.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const categoryList = ["공연", "전시"]; // "스포츠"
const concertCategoryList = ["음악", "연극", "기타"];
// const sportsCategoryList = ["야구", "축구", "농구"];
const isReservationList = ["예", "아니오"];
const methodList = ["구글폼", "예매 대행"];

const defaultValues = {
  show_type: categoryList[0],
  show_sub_type: concertCategoryList[0],
  title: "",
  univ: "",
  department: "",
  location: "",
  location_detail: "",
  is_reservation: isReservationList[0],
};

const defaultResValues = { method: methodList[0], google_form_url: "", price: "", head_count: "", date_time: [] };

const PostUploadPage = () => {
  const navigate = useNavigate();
  const [form, onChangeForm] = useInputs(defaultValues);
  const [resForm, onChangeResForm] = useInputs(defaultResValues);

  const [tagsInput, setTagInputs] = useState<string[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgPreviewUrls, setImgPreviewUrls] = useState<string[]>([]);
  const { data: main_image_color } = useColor(imgPreviewUrls[0], "hex");
  const [date, setDate] = useState({
    start_date: "",
    end_date: "",
  });
  const [location, setLocation] = useState<string>("");
  const [position, setPosition] = useState<object>({});
  const [editorData, setEditorData] = useState<string>("");
  const [roundList, setRoundList] = useState<DateWithTimeObj[]>([]);
  const [editorNoticeData, setEditorNoticeData] = useState<string>("");

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImgFiles([...imgFiles, ...e.target.files]);
    const previewImgSrc = [...e.target.files].map((file) => URL.createObjectURL(file));
    setImgPreviewUrls([...imgPreviewUrls, ...previewImgSrc]);
  };

  const handleRemoveImage = (image: string) => {
    const deleteImgIndex = imgPreviewUrls.indexOf(image);
    // file 객체 리스트에서 제거
    const newImgFiles = [...imgFiles.slice(0, deleteImgIndex), ...imgFiles.slice(deleteImgIndex + 1)];
    setImgFiles(newImgFiles);
    // 미리보기 blob url 리스트에서 제거
    setImgPreviewUrls((prev) => prev.filter((previewUrl) => previewUrl !== image));
  };

  useEffect(() => {
    return () => {
      if (imgPreviewUrls) {
        imgPreviewUrls.forEach((objUrl) => URL.revokeObjectURL(objUrl));
      }
    };
  }, [imgPreviewUrls]);

  const handleDateInput = (event: DateInputType) => {
    const { name, value } = event.target;
    setDate({ ...date, [name]: value });
  };

  const handleChangeTags = (tags: string[]) => {
    setTagInputs(tags);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imgFiles.length < 2) {
      toast.error("이미지를 2개 이상 업로드 해주세요.");
      return;
    }
    if (imgFiles.length > 10) {
      toast.error("이미지를 10개 이하로 업로드 해주세요.");
      return;
    }
    if (!form.title || !form.univ || !form.department) {
      toast.error("주최자 정보를 입력해주세요.");
      return;
    }
    if (!date.start_date || !date.end_date) {
      toast.error("기간을 입력해주세요.");
      return;
    }
    if (!location) {
      toast.error("주소를 입력해주세요.");
      return;
    }
    if (!tagsInput.length) {
      toast.error("tag를 입력해주세요.");
      return;
    }
    if (form.is_reservation === "예") {
      if (resForm.method === "구글폼" && !resForm.google_form_url) {
        toast.error("구글폼 URL을 입력해주세요.");
        return;
      }
      if (resForm.method === "예매 대행" && (resForm.price === null || !resForm.head_count || resForm.date_time.length || !editorNoticeData)) {
        toast.error("예매 작성 폼을 완성해주세요.");
        return;
      }
    }

    const resizedImgFiles = await getResizedImgFiles(imgFiles);
    console.log(resizedImgFiles);
    const base64EncodedContents = (!!editorData && bytesToBase64(new TextEncoder().encode(editorData))) || null;
    const base64EncodedNotice =
      (resForm.method === "예매 대행" && !!editorNoticeData && bytesToBase64(new TextEncoder().encode(editorNoticeData))) || null;

    const roundListToDateTime = () => {
      return roundList.map((item) => item.date + " - " + item.time);
    };

    const result: ShowFormResultType = {
      ...form,
      main_image_color: main_image_color as string,
      show_sub_type: form.show_type === "전시" ? null : form.show_sub_type,
      start_date: date.start_date,
      end_date: date.end_date,
      location,
      location_detail: form.location_detail ? form.location_detail : null,
      position: JSON.stringify(position),
      tags: JSON.stringify(convertArrayToObject(tagsInput)),
      content: base64EncodedContents,
      is_reservation: form.is_reservation === "예" ? "1" : "0",
      //
      ...resForm,
      method: form.is_reservation === "예" ? (resForm.method === "구글폼" ? "google" : "agency") : null,
      google_form_url: (resForm.method === "구글폼" && resForm.google_form_url) || null,
      price: (resForm.method === "예매 대행" && resForm.price.toString()) || null,
      head_count: (resForm.method === "예매 대행" && resForm.head_count.toString()) || null,
      date_time: (resForm.method === "예매 대행" && JSON.stringify(convertArrayToObject(roundListToDateTime()))) || null,
      notice: base64EncodedNotice,
    };

    const formData = new FormData();

    // 이미지 파일
    formData.append("mainImage", resizedImgFiles[0]); // 메인 이미지
    const finalSubImages = resizedImgFiles.slice(1);
    for (let i = 0; i < finalSubImages.length; i++) {
      formData.append("subImages", finalSubImages[i]); // 서브 이미지
    }

    const fileNames: { [key: number]: string } = {};
    finalSubImages.forEach((file: File, index: number) => (fileNames[index + 1] = file.name));
    formData.append("sub_images_url", JSON.stringify(fileNames)); // 서브 이미지 순서

    // 텍스트
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
      //
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
        formData.append(key, result[key] as string);
      }
    }

    mutate(formData);
  };

  // 게시글 업로드 POST
  const { mutate } = useMutation({
    mutationFn: (formData: FormData) => postShow(formData),
    onSuccess: (data) => {
      if (data) {
        toast.success("게시글 업로드 성공");
        navigate("/mypage/admin/post");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <form className={styles["post-upload-section-form"]} onSubmit={handleSubmit}>
      <section>
        <h2 className={styles["title"]}>공연/전시 이미지</h2> {/*스포츠 */}
        <div className={styles["upload-imgs-wrapper"]}>
          <label className={styles["upload-img-input"]}>
            <ImgUploadIcon />
            <input type="file" accept="image/*" multiple onChange={handleChangeImage} />
          </label>
          <ul className={styles["imgs-list"]}>
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
        <RadioButtonGroup radioList={categoryList} name="show_type" onChange={onChangeForm} />
        {/* TODO: show_type에 맞는 sub_type 값 처리 */}
        {form.show_type === "공연" && (
          <RadioButtonGroup radioList={concertCategoryList} name="show_sub_type" defaultValue={form.show_sub_type} onChange={onChangeForm} />
        )}
        {/* {form.show_type === "스포츠" && (
          <RadioButtonGroup radioList={sportsCategoryList} name="show_sub_type" defaultValue={form.show_sub_type} onChange={onChangeForm} />
        )} */}
      </section>

      <section>
        <h2 className={cx("a11y-hidden", "title")}>주최 정보</h2>
        <InputField
          type="text"
          name="title"
          placeholder="제목을 입력해주세요."
          value={form.title}
          onChange={onChangeForm}
          style={{ padding: "0 1rem" }}
        >
          제목
        </InputField>
        <InputField
          type="text"
          name="univ"
          placeholder="대학을 입력해주세요."
          value={form.univ}
          onChange={onChangeForm}
          style={{ padding: "0 1rem" }}
        >
          대학
        </InputField>
        <InputField
          type="text"
          name="department"
          placeholder="학과 또는 학부를 입력해주세요."
          value={form.department}
          onChange={onChangeForm}
          style={{ padding: "0 1rem" }}
        >
          학과
        </InputField>
      </section>

      <section>
        <h2 className={styles["title"]}>기간</h2>
        <div className={styles["l_date"]}>
          <DatePicker type="period" startDate={date.start_date} endDate={date.end_date} onChange={handleDateInput} />
        </div>
      </section>

      <section>
        <h2 className={styles["title"]}>주소</h2>
        <div className={styles["l_address"]}>
          <InputField type="text" name="location" placeholder="도로명 주소" value={location} labelHidden style={{ padding: "0 1rem" }} readOnly>
            도로명 주소
          </InputField>
          <Postcode setPosition={setPosition} setLocation={setLocation} />
        </div>
        <InputField
          type="text"
          name="location_detail"
          placeholder="상세 주소"
          value={form.location_detail}
          onChange={onChangeForm}
          labelHidden
          style={{ padding: "0 1rem" }}
        >
          상세 주소
        </InputField>
      </section>

      <section className={styles["tags-section"]}>
        <h2 className={styles["title"]}>태그</h2>
        <TagInput handleChange={handleChangeTags} />
      </section>

      <section>
        <h2 className={styles["title"]}>소개</h2>
        <Editor editorData={editorData} setEditorData={setEditorData} />
      </section>

      <section>
        <h2 className={styles["title"]}>예매 여부</h2>
        <RadioButtonGroup radioList={isReservationList} name="is_reservation" defaultValue={form.is_reservation} onChange={onChangeForm} />
        {form.is_reservation === "예" && (
          <>
            <h3 className={styles["title"]}>예매 방법</h3>
            <RadioButtonGroup radioList={methodList} name="method" defaultValue={resForm.method} onChange={onChangeResForm} />
            {resForm.method === "구글폼" ? (
              <InputField
                type="url"
                name="google_form_url"
                placeholder="구글폼 URL을 입력해주세요."
                labelHidden
                value={resForm.google_form_url}
                onChange={onChangeResForm}
                // pattern="https://.*"
              >
                구글폼url
              </InputField>
            ) : (
              <ReservationForm
                form={resForm}
                onChange={onChangeResForm}
                roundList={roundList}
                setRoundList={setRoundList}
                editorNoticeData={editorNoticeData}
                setEditorNoticeData={setEditorNoticeData}
              />
            )}
          </>
        )}
      </section>

      <Button type="submit">업로드하기</Button>
    </form>
  );
};

export default PostUploadPage;
