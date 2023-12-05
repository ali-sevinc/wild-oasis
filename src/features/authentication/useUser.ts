import { useQuery } from "@tanstack/react-query";

import { User } from "@supabase/supabase-js";
import { getUser } from "../../services/apiAuth";

export default function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  }) as { data: User; isLoading: boolean };
  return { user, isLoading, isAuthenticated: user?.role === "authenticated" };
}
