import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserLikeList } from "@/apis";
import { FilterButton } from "@/components/common";
import { LikeItem } from "@/components/mypage";
import styles from "./LikeManagePage.module.css";

const categories = ["공연", "전시"];

const LikeManagePage = () => {
  const [showText, setShowText] = useState("공연");

  const handleClickFilterButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { textContent: value } = e.target as HTMLButtonElement;
    setShowText(value!);
  };

  const {
    status,
    error,
    data: userLikeList,
  } = useQuery({
    queryKey: ["userLikeList"],
    queryFn: () => getUserLikeList(),
  });

  if (status === "pending") return <h1>loading...</h1>;
  if (status === "error") return <h1>{error.message}</h1>;

  return (
    <div className={styles["filter-row"]}>
      <div className={styles["filter-contents"]}>
        {categories.map((item) => (
          <FilterButton key={item} selected={showText === item} onClick={handleClickFilterButton}>
            {item}
          </FilterButton>
        ))}
      </div>
      <LikeItem showText={showText} userLikeList={userLikeList} />
    </div>
  );
};

export default LikeManagePage;
