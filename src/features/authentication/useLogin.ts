import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Login, login } from "../../services/apiAuth";

export default function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: mutateLogin,
    isPending: isLogin,
    error: loginError,
  } = useMutation({
    mutationFn: ({ email, password }: Login) => login({ email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.data.user);
      toast.success(`Welcome ${data.data.user.email}`);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  return { mutateLogin, isLogin, loginError };
}
