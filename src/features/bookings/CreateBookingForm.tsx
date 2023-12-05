import { useEffect, useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import {
  BookinType,
  CreateBookingDataType,
  getBookingsBetweenDates,
} from "../../services/apiBookings";
import useCabins from "../cabins/useCabins";
import { CabinType } from "../cabins/CabinRow";
import useCreateBooking from "./useCreateBooking";
import useSettings from "../settings/useSettings";
import { formatCurrency, subtractDates } from "../../utils/helpers";

import FormRow from "../../ui/FormRow";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Form from "../../ui/Form";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;
const Prices = styled.div`
  padding: 0.8rem 0;
  text-align: end;
`;

export default function CreateBookingForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCabin, setSelectedCabin] = useState("");
  const [guestNums, setGuestNums] = useState<string>("");
  const [hasBreakfast, setHasBreakfast] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const [betweenBookings, setBetweenBooking] = useState<BookinType[]>([]);
  const queryClient = useQueryClient();

  const { cabins, isLoading } = useCabins();
  const { addNewBooking, isPending } = useCreateBooking();
  const { data: settings } = useSettings();

  const guest: { fullName: string; id: number } = queryClient.getQueryData([
    "guest",
  ])!;

  useEffect(
    function () {
      if (!startDate || !endDate) return;
      async function getBookins() {
        const bookings = await getBookingsBetweenDates({ startDate, endDate });
        setBetweenBooking(bookings);
      }
      getBookins();
    },
    [startDate, endDate]
  );

  const betweenIds = betweenBookings.map((book) => book.cabinId);
  const availableCabins: CabinType[] =
    startDate && endDate
      ? cabins?.filter((cab) => !betweenIds.includes(cab.id))
      : [];

  const today = new Date();
  const end = new Date(startDate || today);
  end.setDate(end.getDate() + 1);

  function handleCancel() {
    queryClient.removeQueries();
    onClose?.();
  }

  const breakfastPrice = settings ? settings?.breakfastPrice : 15;
  const cabin = availableCabins.find((i) => i.id === +selectedCabin);
  const numNights = subtractDates(endDate, startDate);
  const cabinPrice =
    (cabin && numNights * (cabin!.regularPrice - cabin!.discount)) || 0;
  const extrasPrice = hasBreakfast
    ? numNights * breakfastPrice * +guestNums
    : 0;
  const totalPrice = cabinPrice + extrasPrice;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const guestId = guest.id;

    if (!guestId || !selectedCabin || !cabin) return;

    const newBookingData: CreateBookingDataType = {
      cabinId: Number(selectedCabin),
      cabinPrice,
      endDate,
      extrasPrice,
      guestId,
      hasBreakfast,
      isPaid,
      numGuests: Number(guestNums),
      observations: "",
      startDate,
      totalPrice,
      status: "unconfirmed",
    };
    // console.log(newBookingData);
    addNewBooking(newBookingData);
    handleCancel();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Heading as="h2">Create new booking</Heading>

      <FormRow label="Guest Name">
        <Input defaultValue={guest?.fullName?.toUpperCase()} disabled />
      </FormRow>
      <FormRow label="Guest No">
        <Input defaultValue={guest?.id} disabled />
      </FormRow>

      <FormRow label="Start date" id="startDate">
        <Input
          type="date"
          min={today.toISOString().slice(0, 10)}
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </FormRow>
      <FormRow label="End date" id="endDate">
        <Input
          type="date"
          min={end.toISOString().slice(0, 10)}
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </FormRow>
      <FormRow label="Available Cabins" id="cabin">
        {availableCabins.length > 0 ? (
          <StyledSelect
            disabled={isLoading}
            id="cabin"
            value={selectedCabin}
            onChange={(e) => setSelectedCabin(e.target.value)}
            required
          >
            {availableCabins.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} - {cabin.maxCapacity} capacity
              </option>
            ))}
          </StyledSelect>
        ) : (
          <p>No available cabin found.</p>
        )}
      </FormRow>
      <FormRow label="Guests number" id="numGuests">
        <Input
          required
          type="number"
          id="numGuests"
          value={guestNums}
          onChange={(e) => setGuestNums(e.target.value)}
          min={1}
          disabled={!selectedCabin}
          max={
            availableCabins.find((i) => i.id === +selectedCabin)?.maxCapacity
          }
        />
      </FormRow>
      <FormRow label="Breakfast" id="breakfast">
        <input
          type="checkbox"
          id="breakfast"
          onChange={(e) => setHasBreakfast(e.target.checked)}
        />
      </FormRow>
      <FormRow label="Paid" id="paid">
        <input
          type="checkbox"
          id="paid"
          onChange={(e) => setIsPaid(e.target.checked)}
        />
      </FormRow>

      <Prices>
        Total price: <span>{formatCurrency(totalPrice)}</span> (
        <span>{formatCurrency(extrasPrice)}</span> are extras)
      </Prices>

      <FormRow>
        <Button disabled={isPending} type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button disabled={isPending}>Add booking</Button>
      </FormRow>
    </Form>
  );
}
