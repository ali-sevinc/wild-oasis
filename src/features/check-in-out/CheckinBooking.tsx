import { useState, useEffect } from "react";
import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox";

import { formatCurrency } from "../../utils/helpers";
import { useMoveBack } from "../../hooks/useMoveBack";
import useSettings from "../settings/useSettings";
import useBooking from "../bookings/useBooking";
import useCheckin from "./useCheckin";

import ButtonGroup from "../../ui/ButtonGroup";
import ButtonText from "../../ui/ButtonText";
import Checkbox from "../../ui/Checkbox";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import Row from "../../ui/Row";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState<boolean>(false);
  const [addBreackfast, setAddBreackfast] = useState<boolean>(false);
  const moveBack = useMoveBack();
  const { data: booking, isLoading } = useBooking();

  const { checkin, isPending } = useCheckin();
  const { data: settings, isLoading: isLoadingSettings } = useSettings();

  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking?.isPaid]);

  if (isLoading || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numNights,
    numGuests,
    hasBreakfast,
  } = booking;

  const optionalBreakfastPrice = settings
    ? settings.breakfastPrice * numNights * numGuests
    : 0;
  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreackfast) {
      checkin({
        bookingId,
        breakFast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkin({ bookingId, breakFast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            id="breakfast"
            checked={addBreackfast}
            onChange={() => {
              setAddBreackfast((prev) => !prev);
              setConfirmPaid(false);
            }}
          >
            Wait to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          id={bookingId}
          checked={confirmPaid}
          disabled={confirmPaid || isPending}
          onChange={() => setConfirmPaid((prev) => !prev)}
        >
          I confirm that {guests.fullName} has paid the total amount of{" "}
          {!addBreackfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )}) `}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button disabled={!confirmPaid || isPending} onClick={handleCheckin}>
          Check in booking #{bookingId}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
