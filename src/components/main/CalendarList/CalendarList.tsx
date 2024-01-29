import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BasicCard } from "@/components/common";
import { getShowList } from "@/apis";
import styles from "./CalendarList.module.css";
import { ShowType } from "@/types";
import { CalendarFilters } from "../CalendarFilters/CalendarFilters";
import { CalendarListSkeleton } from "..";

interface PropsType {
  filters: CalendarFilters;
}

const CalendarList: React.FC<PropsType> = ({ filters }) => {
  const { data, isPending } = useQuery({
    queryKey: ["showDatas", filters],
    queryFn: async () => await getShowList(filters.category, filters.date, filters.date),
    select: (item) => item.slice(0, 4),
    throwOnError: true,
    placeholderData: keepPreviousData,
  });

  if (isPending) return <CalendarListSkeleton />;
  return (
    <>
      <div className={styles["cards-container"]}>
        {data?.map((item: ShowType) => {
          return <BasicCard key={item.id} item={item} />;
        })}
      </div>
    </>
  );
};

export default CalendarList;
