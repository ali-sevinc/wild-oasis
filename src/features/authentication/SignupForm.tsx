import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import useSignup from "./useSignup";
import Input from "../../ui/Input";
import Form from "../../ui/Form";

interface FormDataType {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } =
    useForm<FormDataType>();
  const { errors } = formState;

  const { isSignUp, mutateSignUp } = useSignup();

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    mutateSignUp(
      {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      },
      { onSettled: () => reset() }
    );
  };

  const onError: SubmitErrorHandler<FormDataType> = () => {
    // console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow
        id="fullName"
        label="Full name"
        error={errors?.fullName?.message || ""}
      >
        <Input
          disabled={isSignUp}
          type="text"
          id="fullName"
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow
        id="email"
        label="Email address"
        error={errors?.email?.message || ""}
      >
        <Input
          disabled={isSignUp}
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Provide a valid email.",
            },
          })}
        />
      </FormRow>

      <FormRow
        id="password"
        label="Password (min 8 characters)"
        error={errors?.password?.message || ""}
      >
        <Input
          disabled={isSignUp}
          type="password"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 chars.",
            },
          })}
        />
      </FormRow>

      <FormRow
        id="passwordConfirm"
        label="Repeat password"
        error={errors?.passwordConfirm?.message || ""}
      >
        <Input
          disabled={isSignUp}
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to mathed.",
          })}
        />
      </FormRow>

      <FormRow>
        <Button disabled={isSignUp} $variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isSignUp}>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
