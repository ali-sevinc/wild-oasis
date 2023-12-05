import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { FormDataType, createEditCabin } from "../../services/apiCabins";

interface EditFunction {
  newCabinData: FormDataType;
  id: number;
}

export default function useEditCabin() {
  const queryClient = useQueryClient();
  const { mutate: editMutate, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }: EditFunction) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("The cabin successfully edited.");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editMutate, isEditing };
}
