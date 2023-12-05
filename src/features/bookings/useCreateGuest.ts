import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuests } from "../../services/apiBookings";
import toast from "react-hot-toast";

export default function useCreateGuest() {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: createGuests,
    onSuccess: (data) => {
      toast.success("New guest successfully created.");
      queryClient.setQueryData(["guest"], data?.[0]);
    },
    onError: () => toast.error("Created new guest failed."),
  });

  return { data, mutate, isPending };
}
