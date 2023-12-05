import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { FormDataType } from "../../services/apiCabins";

import useCreateCabin from "./useCreateCabin";
import useEditCabin from "./useEditCabin";
import { CabinType } from "./CabinRow";

import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Form from "../../ui/Form";

interface CabinToEditType {
  cabinToEdit?: CabinType;
  onClose?: () => void;
}

function CreateCabinForm({ cabinToEdit, onClose }: CabinToEditType) {
  const isEditSession = cabinToEdit?.id !== undefined ? true : false;
  // console.log(cabinToEdit);
  const { register, handleSubmit, reset, getValues, formState } =
    useForm<FormDataType>({
      defaultValues: isEditSession
        ? {
            name: cabinToEdit?.name,
            description: cabinToEdit?.description,
            discount: cabinToEdit?.discount.toString(),
            maxCapacity: cabinToEdit?.maxCapacity.toString(),
            regularPrice: cabinToEdit?.regularPrice.toString(),
            image: cabinToEdit?.image,
          }
        : {},
    });

  const { errors } = formState;

  // console.log(errors);

  const { createMutate, isCreating } = useCreateCabin();
  const { editMutate, isEditing } = useEditCabin();

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    // console.log(data);
    // console.log({ ...data});
    if (isEditSession) {
      editMutate(
        { newCabinData: data, id: cabinToEdit!.id },
        {
          onSuccess: () => {
            reset();
            onClose?.();
          },
        }
      );
    } else {
      createMutate(data, {
        onSuccess: () => {
          reset();
          onClose?.();
        },
      });
    }
  };
  //we actually dont need this fnc. use for autocomplete
  const onError: SubmitErrorHandler<FormDataType> = () => {
    // console.log(errors);
  };

  const isLoading = isCreating || isEditing;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onClose ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" id="name" error={errors?.name?.message || ""}>
        <Input
          disabled={isLoading}
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow
        label="Maximum capacity"
        id="maxCapacity"
        error={errors?.maxCapacity?.message || ""}
      >
        <Input
          disabled={isLoading}
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least one",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Regular price"
        id="regularPrice"
        error={errors?.regularPrice?.message || ""}
      >
        <Input
          disabled={isLoading}
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least one",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Discount"
        id="discount"
        error={errors?.discount?.message || ""}
      >
        <Input
          disabled={isLoading}
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              +value < +getValues().regularPrice ||
              "Discount should be less then regular price.",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        id="description"
        error={errors?.description?.message || ""}
      >
        <Textarea
          disabled={isLoading}
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow id="image" label="Cabin photo" error="">
        <FileInput
          disabled={isLoading}
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow error="" id="" label="">
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button disabled={isLoading}>
          {isEditSession ? "Edit cabin" : "Add cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
