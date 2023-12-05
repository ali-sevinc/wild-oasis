import { PAGE_SIZE } from "../utils/consts";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export interface BookinType {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinId: number;
  cabinPrice: number;
  totalPrice: number;
  status: "checked-out" | "unconfirmed" | "checked-in";
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  extrasPrice: number;
  guests: {
    fullName: string;
    email: string;
    country: string;
    countryFlag: string;
    nationalID: string;
  };
  cabins: { name: string };
}

interface BookingsPropsType {
  filter: { field: string; value: string; method: "eq" | "gte" | "lte" } | null;
  sortBy: { field: string; direction: "asc" | "desc" } | null;
  page: number;
}
export async function getBookings({ filter, sortBy, page }: BookingsPropsType) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      {
        count: "exact",
      }
    );

  //filter
  if (filter !== null)
    query = query[filter.method || "eq"](filter.field, filter.value);

  //sort
  if (sortBy !== null)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings not found");
  }

  return { data, count };
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data as {
    created_at: string;
    totalPrice: number;
    extrasPrice: number;
  }[];
}

export interface StaysType {
  cabinId: number;
  cabinPrice: number;
  created_at: string;
  endDate: string;
  extrasPrice: number;
  guestId: number;
  guests: { fullName: string; nationality: string; countryFlag: string };
  hasBreakfast: boolean;
  id: number;
  isPaid: boolean;
  numGuests: number;
  numNights: number;
  observations: string;
  startDate: string;
  status: "checked-out" | "checked-in" | "unconfirmed";
  totalPrice: number;
}
export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data as StaysType[];
}

export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  if (error) {
    throw new Error("Bookings could not get loaded");
  }
  return data as StaysType[];
}

export async function updateBooking(
  id: number,
  obj: {
    status?: "checked-in" | "checked-out";
    isPaid?: true;
    hasBreakfast?: true;
    extrasPrice?: number;
    totalPrice?: number;
  }
) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export interface CreateGuestDataType {
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
}
export async function createGuests(guest: CreateGuestDataType) {
  const convertedData = {
    ...guest,
    countryFlag: `https://flagcdn.com/${guest.countryFlag}.svg`,
  };
  const { error, data } = await supabase
    .from("guests")
    .insert(convertedData)
    .select();
  if (error) console.log(error.message);
  return data;
}

export async function getGuestWithId(id: string) {
  const { data: guest, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Guest could not found");
  }
  return guest;
}

export async function getBookingsBetweenDates({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .gt("startDate", startDate)
    .lt("endDate", endDate);
  if (error) {
    throw new Error("Guest could not found");
  }
  return bookings as BookinType[];
}

export interface CreateBookingDataType {
  startDate: string;
  endDate: string;
  cabinId: number;
  guestId: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
  numGuests: number;
  cabinPrice: number;
  totalPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out";
  extrasPrice: number;
}
export async function createBooking(booking: CreateBookingDataType) {
  const { error } = await supabase.from("bookings").insert(booking);
  if (error) console.log(error.message);
}
