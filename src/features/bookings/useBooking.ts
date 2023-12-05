import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";

import { useParams } from "react-router-dom";
import { BookinType } from "../../services/apiBookings";

export default function useBooking() {
  const params = useParams();
  const bookingId = params.bookingId;
  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(+bookingId!),
    retry: false,
  }) as { data: BookinType; isLoading: boolean; error: Error };

  return { data, isLoading, error };
}
