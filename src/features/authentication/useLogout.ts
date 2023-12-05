import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../../services/apiAuth";

export default function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isLogout, mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Successfully logged out.");
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isLogout, mutateLogout };
}
