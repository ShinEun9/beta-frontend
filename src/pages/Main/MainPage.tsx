import { BannerSection, StorySection, CalendarSection } from "@/components/main";
import "react-loading-skeleton/dist/skeleton.css";

const MainPage = () => {
  return (
    <main>
      <BannerSection />
      <StorySection />
      <CalendarSection />
    </main>
  );
};

export default MainPage;
