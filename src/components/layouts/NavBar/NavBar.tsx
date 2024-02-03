import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./NavBar.module.css";

const cx = classNames.bind(styles);

const navList = [
  { pathname: "/concert", text: "공연" },
  { pathname: "/exhibition", text: "전시" },
  // { pathname: "/sports", text: "스포츠" },
];

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles["navbar-wrapper"]}>
        {navList.map((item) => (
          <li key={item.pathname} className={cx("navbar__item", location.pathname === item.pathname && "selected")}>
            <Link to={item.pathname}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
