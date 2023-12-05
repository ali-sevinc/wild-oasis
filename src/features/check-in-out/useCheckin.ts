import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

interface CheckinType {
  bookingId: number;
  breakFast?:
    | {
        hasBreakfast: true;
        extrasPrice: number;
        totalPrice: number;
      }
    | object;
}
export default function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending } = useMutation({
    mutationFn: ({ bookingId, breakFast }: CheckinType) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakFast,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ type: "active" });
      navigate("/");
    },
    onError: () => toast.error("There was an error while cheked-in."),
  });
  return { checkin, isPending };
}
