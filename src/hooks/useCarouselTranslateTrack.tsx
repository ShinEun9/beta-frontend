import { useEffect } from "react";

const useCarouselTranslateTrack = (index: number) => {
  const translateSlickTrack = () => {
    setTimeout(() => {
      document.querySelectorAll(".slick-track").forEach((item) => {
        (item as HTMLElement).style.transform = "translate3d(0px, 0px, 0px)";
      });
    }, 500);
  };

  useEffect(() => {
    const handleResize = () => {
      index === 1 && translateSlickTrack();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return;
};

export default useCarouselTranslateTrack;
