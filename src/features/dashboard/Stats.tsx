import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";
import { StaysType } from "../../services/apiBookings";

import Stat from "./Stat";

interface PropsType {
  bookings: { created_at: string; totalPrice: number; extrasPrice: number }[];
  confirmedStays: StaysType[];
  numDays: number;
  cabinCount: number;
}
export default function Stats({
  bookings,
  confirmedStays,
  cabinCount,
  numDays,
}: PropsType) {
  const numBookings = bookings?.length;

  const sales = bookings.reduce((acc, book) => acc + book.totalPrice, 0);

  const numCheckins = confirmedStays?.length;

  const occupancyRate =
    confirmedStays.reduce((acc, conf) => acc + conf.numNights, 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={numCheckins}
      />
      <Stat
        title="Opccupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupancyRate * 100) + "%"}
      />
    </>
  );
}
