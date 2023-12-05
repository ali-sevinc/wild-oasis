import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

export default function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isLoadingCheckout } = useMutation({
    mutationFn: (bookingId: number) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ type: "active" });
    },
    onError: () => toast.error("There was an error while cheked-out."),
  });
  return { checkout, isLoadingCheckout };
}
