import styled from "styled-components";

import useRecentBookings from "./useRecentBookings";
import useRecentStays from "./useRecentStays";
import useCabins from "../cabins/useCabins";

import TodayActivity from "../check-in-out/TodayActivity";
import DurationChart from "./DurationChart";
import Spinner from "../../ui/Spinner";
import SalesChart from "./SalesChart";
import Stats from "./Stats";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

export default function DashboardLayout() {
  const { data: bookings, isLoading: isLoadingBookings } = useRecentBookings();

  const {
    confirmedStays,
    isLoading: isLoadingStays,
    numDays,
  } = useRecentStays();

  const { cabins, isLoading: isLoadingCabins } = useCabins();

  if (isLoadingBookings || isLoadingStays || isLoadingCabins)
    return <Spinner />;
  if (!bookings || !confirmedStays) return;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins?.length}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}
