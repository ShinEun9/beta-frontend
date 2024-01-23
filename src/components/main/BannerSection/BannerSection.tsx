import { Suspense } from "react";
import { Banner, BannerSkeleton } from "..";

const BannerSection = () => {
  return (
    <Suspense fallback={<BannerSkeleton />}>
      <Banner />
    </Suspense>
  );
};

export default BannerSection;
