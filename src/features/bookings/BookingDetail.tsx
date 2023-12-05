import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiArrowDownOnSquare, HiArrowUpOnSquare } from "react-icons/hi2";

import { useMoveBack } from "../../hooks/useMoveBack";
import useCheckout from "../check-in-out/useChekout";
import useDeleteBooking from "./useDeleteBooking";
import useBooking from "./useBooking";

import ConfirmDelete from "../../ui/ConfirmDelete";
import ButtonGroup from "../../ui/ButtonGroup";
import BookingDataBox from "./BookingDataBox";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Row from "../../ui/Row";
import Tag from "../../ui/Tag";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { data: booking, isLoading, error } = useBooking();
  const navigate = useNavigate();
  const moveBack = useMoveBack();

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

  if (error) return <p>{error.message}</p>;
  if (!booking) return <Empty resource="booking" />;
  if (isLoading || isLoadingCheckout || isLoadingDeleteBook) return <Spinner />;

  const { status, id } = booking;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <Tag $type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      <Modal>
        <ButtonGroup>
          {status === "unconfirmed" && (
            <Button onClick={() => navigate(`/checkin/${id}`)}>
              <HiArrowDownOnSquare />
              <span>Check in</span>
            </Button>
          )}
          {status === "checked-in" && (
            <Button onClick={() => checkout(id)}>
              <HiArrowUpOnSquare />
              <span>Check out</span>
            </Button>
          )}
          <Modal.Open opens="delete">
            <Button disabled={isLoadingDeleteBook} $variation="danger">
              Delete
            </Button>
          </Modal.Open>

          <Button $variation="secondary" onClick={moveBack}>
            Back
          </Button>
        </ButtonGroup>
        <Modal.Window name="delete">
          <ConfirmDelete
            onConfirm={() => {
              deleteBook(id);
              navigate(-1);
            }}
            disabled={isLoadingDeleteBook}
            resourceName="booking"
          />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default BookingDetail;
