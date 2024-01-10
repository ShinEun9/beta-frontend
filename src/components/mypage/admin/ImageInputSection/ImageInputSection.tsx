import React, { useEffect } from "react";
import ImgUploadIcon from "@/assets/ImgUploadIcon.svg?react";
import { DeleteButton } from "@/components/common";
import styles from "./ImageInputSection.module.css";

interface PropsType {
  imgFiles: File[];
  setImgFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imgPreviewUrls: string[];
  setImgPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  imgExistingUrls?: string[];
  setImgExistingUrls?: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageInputSection: React.FC<PropsType> = ({
  imgFiles,
  setImgFiles,
  imgPreviewUrls,
  setImgPreviewUrls,
  imgExistingUrls,
  setImgExistingUrls,
}) => {
  useEffect(() => {
    return () => {
      if (imgPreviewUrls) {
        imgPreviewUrls.forEach((objUrl) => URL.revokeObjectURL(objUrl));
      }
    };
  }, [imgPreviewUrls]);

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
    setImgExistingUrls && setImgExistingUrls((prev) => prev.filter((existingUrl) => existingUrl !== image));
  };

  return (
    <section>
      <div className={styles["update-imgs-wrapper"]}>
        <label className={styles["update-img-input"]}>
          <ImgUploadIcon />
          <input type="file" accept="image/*" multiple onChange={handleChangeImage} />
        </label>
        <ul className={styles["imgs-list"]}>
          {imgExistingUrls &&
            imgExistingUrls.map((image) => (
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
  );
};

export default ImageInputSection;
