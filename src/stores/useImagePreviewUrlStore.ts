import { create } from "zustand";

interface useImagePreviewUrlStore {
  imagePreviewUrls: string[];
  resetImagePreviewUrls: () => void;
  addImagePreviewUrls: (files: FileList) => void;
  removeImagePreviewUrls: (blobUrl: string) => void;
}

export const useImagePreviewUrlStore = create<useImagePreviewUrlStore>((set) => ({
  imagePreviewUrls: [],
  resetImagePreviewUrls: () => set((state) => ({ ...state, imagePreviewUrls: [] })),
  addImagePreviewUrls: (files) => {
    const previewImgSrc = [...files].map((file) => URL.createObjectURL(file));
    console.log(previewImgSrc);
    set((state) => ({ ...state, imagePreviewUrls: [...state.imagePreviewUrls, ...previewImgSrc] }));
  },
  removeImagePreviewUrls: (blobUrl: string) =>
    set((state) => ({ ...state, imagePreviewUrls: state.imagePreviewUrls.filter((previewUrl) => previewUrl !== blobUrl) })),
}));
