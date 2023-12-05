import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { signup } from "../../services/apiAuth";

export default function useSignup() {
  const { mutate: mutateSignUp, isPending: isSignUp } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("New user successfully created. Please verify email!");
    },
    onError: (err) => toast.error(err.message),
  });

  return { mutateSignUp, isSignUp };
}
