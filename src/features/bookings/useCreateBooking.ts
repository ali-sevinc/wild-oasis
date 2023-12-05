import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useCreateBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: addNewBooking, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("New booking successfully created.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate("/bookings");
    },
    onError: () => toast.error("Adding new booking failed."),
  });

  return { addNewBooking, isPending };
}
