import React from "react";
import classNames from "classnames/bind";
import { BasicCard, NullField, TicketCard } from "@/components/common";
import { ShowType } from "@/types";
import styles from "./LikeItem.module.css";

const cx = classNames.bind(styles);

interface PropsType {
  showText: string;
  userLikeList: ShowType[];
}

const LikeItem: React.FC<PropsType> = ({ showText, userLikeList }) => {
  const filteredList = userLikeList.filter((data) => data.show_type === showText);
  if (filteredList.length === 0) {
    const particle = showText === "공연" ? "이" : "가";
    const typeText = `좋아요한 ${showText}${particle} 없어요!`;
    return <NullField text1={typeText} text2="포스터에 관심을 남겨보세요!" />;
  }

  return (
    <ul className={cx(showText === "전시" ? "exhibition-list" : "concert-list")}>
      {filteredList.map((item) => {
        return <li key={item.id}>{showText === "전시" ? <BasicCard item={item} /> : <TicketCard item={item} />}</li>;
      })}
    </ul>
  );
};

export default LikeItem;
