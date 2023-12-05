import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { updateUser } from "../../services/apiAuth";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: userMutate, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast.success("The user successfully updated.");
      queryClient.setQueryData(["user"], data?.user);
    },
    onError: (err) => toast.error(err.message),
  });

  return { userMutate, isUpdatingUser };
}
