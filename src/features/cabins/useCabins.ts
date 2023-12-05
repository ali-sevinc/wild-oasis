import { useQuery } from "@tanstack/react-query";

import { getCabins } from "../../services/apiCabins";
import { CabinType } from "./CabinRow";

export default function useCabins() {
  const { isLoading, data: cabins } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  }) as { isLoading: boolean; data: CabinType[] };

  return { isLoading, cabins };
}
