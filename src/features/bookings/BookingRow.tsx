import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import useDeleteBooking from "./useDeleteBooking";
import useCheckout from "../check-in-out/useChekout";

import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";
import { BookinType } from "../../services/apiBookings";

import ConfirmDelete from "../../ui/ConfirmDelete";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import Tag from "../../ui/Tag";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

interface PropsType {
  booking: BookinType;
}
function BookingRow({
  booking: {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}: PropsType) {
  const navigate = useNavigate();

  const { checkout, isLoadingCheckout } = useCheckout();
  const { deleteBook, isLoadingDeleteBook } = useDeleteBooking();

  const statusToTagName: {
    unconfirmed: "blue";
    "checked-in": "green";
    "checked-out": "silver";
  } = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  if (isLoadingCheckout || isLoadingDeleteBook) return <Spinner />;
  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag $type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              onClick={() => navigate(`/bookings/${bookingId}`)}
              icon={<HiEye />}
            >
              See Details
            </Menus.Button>
            {status === "unconfirmed" && (
              <Menus.Button
                onClick={() => navigate(`/checkin/${bookingId}`)}
                icon={<HiArrowDownOnSquare />}
              >
                Check in
              </Menus.Button>
            )}
            {status === "checked-in" && (
              <Menus.Button
                onClick={() => checkout(bookingId)}
                icon={<HiArrowUpOnSquare />}
              >
                Check out
              </Menus.Button>
            )}
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            onConfirm={() => deleteBook(bookingId)}
            disabled={isLoadingDeleteBook}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
