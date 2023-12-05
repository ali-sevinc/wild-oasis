import { useQuery } from "@tanstack/react-query";
import { getGuestWithId } from "../../services/apiBookings";
export default function useGetGuest(id: string) {
  const { data: guest, isLoading } = useQuery({
    queryKey: ["guest"],
    queryFn: () => getGuestWithId(id),
  });

  return { guest, isLoading };
}
