import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NullField } from "@/components/common";
import { LikeItem } from "@/components/mypage";
import { ShowType } from "@/types";
import styles from "./LikeItemList.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface PropsType {
  selectedCategory: string;
}

const LikeItemList = React.memo<PropsType>(({ selectedCategory }) => {
  const queryClient = useQueryClient();
  const userLikeList = queryClient.getQueryData<ShowType[]>(["userLikeList"]) || [];

  const filteredList = userLikeList.filter((data) => data.show_type === selectedCategory);

  if (filteredList.length === 0) {
    return (
      <NullField text1={`좋아요한 ${selectedCategory}${selectedCategory === "공연" ? "이" : "가"} 없어요!`} text2="포스터에 관심을 남겨보세요!" />
    );
  }

  return (
    <ul className={cx(selectedCategory === "전시" ? "exhibition-list" : "concert-list")}>
      {filteredList.map((item) => (
        <LikeItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

export default LikeItemList;
