import React from "react";
import styles from "./BasicCard.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface PropsType {
  item: { title: string; location: string; date: string; imgSrc: string; id: string };
}
const BasicCard: React.FC<PropsType> = ({ item }) => {
  return (
    <article className={styles.card}>
      <div className={styles["card__img-wrapper"]}>
        <img className={styles["card__img"]} src={item.imgSrc} />
      </div>
      <h3 className={cx("card__title", "ellipsis")}>{item.title}</h3>
      <p className={cx("card__location", "ellipsis")}>{item.location}</p>
      <p className={styles["card__date"]}>{item.date}</p>
    </article>
  );
};

export default BasicCard;
