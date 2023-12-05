import { ChangeEvent } from "react";

import { useSearchParams } from "react-router-dom";

import Select from "./Select";

export default function SortBy({
  options,
}: {
  options: { value: string; label: string }[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }
  const searchValue = searchParams.get("sortBy") || "";

  return (
    <Select
      value={searchValue}
      options={options}
      type="white"
      onChange={handleChange}
    />
  );
}
