import { useState, FormEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import {
  CreateGuestDataType,
  getGuestWithId,
} from "../../services/apiBookings";
import useCreateGuest from "./useCreateGuest";

import CreateBookingForm from "./CreateBookingForm";
import Heading from "../../ui/Heading";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";

export default function CreateGuestForm({ onClose }: { onClose?: () => void }) {
  const [isNewGuest, setIsNewGuest] = useState<boolean>(false);
  const [guestId, setGuestId] = useState<string>("");
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm<CreateGuestDataType>();
  const { errors } = formState;
  const { mutate, isPending } = useCreateGuest();

  const guest = queryClient.getQueryData(["guest"]);

  const onSubmit: SubmitHandler<CreateGuestDataType> = (data) => {
    mutate(data);
  };

  async function handleSubmitWithId(event: FormEvent) {
    event.preventDefault();
    if (!guestId) return;
    const guest = await getGuestWithId(guestId);
    setGuestId("");
    queryClient.setQueryData(["guest"], guest);
  }

  return (
    <>
      {!guest &&
        (!isNewGuest ? (
          <Form onSubmit={handleSubmitWithId} key="guest-with-id">
            <FormRow label="Guest no" id="guest-no">
              <Input
                id="guest-no"
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
                type="number"
              />
            </FormRow>
            <FormRow>
              <Button>Continue with guest no</Button>
              <p>Or</p>
              <Button type="button" onClick={() => setIsNewGuest(true)}>
                Create new guest
              </Button>
            </FormRow>
          </Form>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)} key="create-guest">
            <Heading as="h2">Create new guest</Heading>
            <FormRow
              label="Name"
              id="fullName"
              error={errors?.fullName?.message || ""}
            >
              <Input
                type="text"
                id="fullName"
                {...register("fullName", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Email"
              id="email"
              error={errors?.email?.message || ""}
            >
              <Input
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
              label="NationalID"
              id="nationalID"
              error={errors?.nationalID?.message || ""}
            >
              <Input
                type="text"
                id="nationalID"
                {...register("nationalID", {
                  required: "This field is required",
                  validate: (value) =>
                    value.length === 10 || "Please enter a valid national-id",
                })}
              />
            </FormRow>
            <FormRow
              label="Nationality"
              id="nationality"
              error={errors?.nationality?.message || ""}
            >
              <Input
                type="text"
                id="nationality"
                {...register("nationality", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Flag Code"
              id="flag-code"
              error={errors?.countryFlag?.message || ""}
            >
              <Input
                type="text"
                id="flag-code"
                {...register("countryFlag", {
                  required: "This field is required",
                  validate: (value) =>
                    value.length === 2 ||
                    "This field needs '2' chars of country code.",
                })}
              />
            </FormRow>
            <FormRow>
              <Button disabled={isPending} type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isPending}>Next</Button>
            </FormRow>
          </Form>
        ))}
      {guest && <CreateBookingForm onClose={onClose} />}
    </>
  );
}
