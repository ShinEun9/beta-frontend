import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import { Filters } from "@/components/common";
import { ExhibitionListSection } from "@/components/mainExhibition";
import { getTodayStringDate } from "@/utils";

const MainExhibitionPage = () => {
  const { todayString } = getTodayStringDate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queries = searchParams.toString();

  useEffect(() => {
    const { location, start_date, end_date, progress, date } = queryString.parse(queries);
    if (!location || !start_date || !end_date || !progress || !date) {
      navigate({ search: `?location=all&start_date=${todayString}&end_date=${todayString}&progress=1&date=오늘` });
    }
  }, [searchParams]);

  return (
    <main>
      <Filters />
      <ExhibitionListSection />
    </main>
  );
};

export default MainExhibitionPage;
