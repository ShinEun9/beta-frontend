import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import { Filters } from "@/components/common";
import { ConcertListSection } from "@/components/mainConcert";
import { getTodayStringDate } from "@/utils";

const MainConcertPage = () => {
  const { todayString } = getTodayStringDate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queries = searchParams.toString();

  useEffect(() => {
    const { location, start_date, end_date, category, progress, date } = queryString.parse(queries);

    if (!location || !start_date || !end_date || !category || !progress || !date) {
      navigate({ search: `?location=all&start_date=${todayString}&end_date=${todayString}&category=all&progress=1&date=오늘` });
    }
  }, [searchParams]);

  return (
    <main>
      <Filters />
      <ConcertListSection />
    </main>
  );
};

export default MainConcertPage;
