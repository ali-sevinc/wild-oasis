import { Link } from "react-router-dom";
import styled from "styled-components";

import { StaysType } from "../../services/apiBookings";

import CheckoutButton from "./CheckoutButton";
import Button from "../../ui/Button";
import { Flag } from "../../ui/Flag";
import Tag from "../../ui/Tag";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

export default function TodayItem({ activity }: { activity: StaysType }) {
  return (
    <StyledTodayItem>
      {activity.status === "unconfirmed" && <Tag $type="green">Arriving</Tag>}
      {activity.status === "checked-in" && <Tag $type="blue">Departing</Tag>}
      <Flag
        src={activity.guests.countryFlag}
        alt={`Flag of  ${activity.guests.nationality}`}
      />
      <Guest>{activity.guests.fullName}</Guest>
      <div>{activity.numNights} nights</div>

      {activity.status === "unconfirmed" && (
        <Button
          sizes="small"
          $variation="primary"
          as={Link}
          to={`/checkin/${activity.id}`}
        >
          Check-in
        </Button>
      )}
      {activity.status === "checked-in" && (
        <CheckoutButton bookingId={activity.id} />
      )}
    </StyledTodayItem>
  );
}
