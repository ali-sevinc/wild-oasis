import { useSearchParams } from "react-router-dom";

import useCabins from "./useCabins";

import CabinRow, { CabinType } from "./CabinRow";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

type SortValues =
  | ["name", "asc"]
  | ["name", "desc"]
  | ["regularPrice", "asc"]
  | ["regularPrice", "desc"]
  | ["maxCapacity", "asc"]
  | ["maxCapacity", "desc"];

export default function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchparams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabins?.length) return <Empty resource="cabins" />;

  const filterValue = searchparams.get("discount") || "all";

  let filteredCabins: CabinType[] = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((item) => item.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((item) => item.discount > 0);

  const sortValue = searchparams.get("sortBy") || "name-asc";

  const [field, direction] = sortValue.split("-") as SortValues;

  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins.sort(
    // (a, b) => (a[field] - b[field]) * modifier
    (a, b) => {
      const aValue = a[field] as number | string;
      const bValue = b[field] as number | string;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return String(aValue).localeCompare(String(bValue)) * modifier;
    }
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}
