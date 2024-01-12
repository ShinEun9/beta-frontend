import { ShowType } from "@/types";
import { create } from "zustand";

interface useShowInfoStoreType {
  showInfo: ShowType | null;
  setShowInfo: (item: ShowType) => void;
}

const useShowInfoStore = create<useShowInfoStoreType>((set) => ({
  showInfo: null,
  setShowInfo: (showInfo) =>
    set(() => ({
      showInfo,
    })),
}));

export default useShowInfoStore;
