import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { BookinType } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/consts";
import { getBookings } from "../../services/apiBookings";

type FilterType = {
  field: string;
  value: string;
  method: "eq" | "gte" | "lte";
} | null;
export default function useBookings() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  //filter
  const filterValue = searchParams.get("status");
  const filter: FilterType =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  //sort
  const sortValue = searchParams.get("sortBy");
  let sortArry;
  if (sortValue) sortArry = sortValue!.split("-") as [string, "asc" | "desc"];
  const sortBy = sortArry
    ? { field: sortArry[0], direction: sortArry[1] }
    : null;

  //pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //query
  const { isLoading, data: bookings } = useQuery({
    queryKey: ["bookings", filterValue, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  }) as { isLoading: boolean; data: { data: BookinType[]; count: number } };

  //pre-fetch
  const pageCount = Math.ceil(bookings?.count / PAGE_SIZE);
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filterValue, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  }
  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filterValue, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });
  }

  return { isLoading, bookings };
}
